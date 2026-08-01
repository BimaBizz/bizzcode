import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { LOCALES } from "@/config/cockpit";
import LayoutRenderer from "@/components/layout-renderer";
import CockpitCollectionPage from "@/components/cockpit-collection-page";
import { getAllPageSlugs, getPageBySlug, getSiteSettings } from "@/lib/cockpit-queries";
import { isSupportedLocale } from "@/lib/i18n";
import { getItems } from "@/lib/cockpit";

export async function generateStaticParams() {
  const localeParams = await Promise.all(
    LOCALES.map(async (locale) => {
      const slugs = await getAllPageSlugs({ locale }).catch(() => []);
      return slugs
        .filter((slug) => slug && slug !== "home")
        .map((slug) => ({ locale, slug: slug.split("/") }));
    })
  );

  return localeParams.flat();
}

export async function generateMetadata({ params, searchParams }) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) return {};

  const slugPath = slug.join("/");
  const resolvedSearchParams = await searchParams;
  const pageQuery = resolvedSearchParams?.page;

  try {
    const [settings, page] = await Promise.all([
      getSiteSettings({ locale }),
      getPageBySlug({ locale, slug: slugPath, page: pageQuery }).catch(() => null),
    ]);

    if (!page) return {};

    const pageSeo = page.seo || {};
    const siteSeo = settings?.seo || {};

    const title = pageSeo.title || page.seo_title || page.title || siteSeo.title || settings?.site_title || "Cockpit Site";
    const description = pageSeo.description || page.seo_description || page.excerpt || siteSeo.description || settings?.site_description || "Content managed from Cockpit";
    const keywords = pageSeo.keywords || siteSeo.keywords || undefined;

    // Resolve OG image URL
    const seoImage = pageSeo.image || siteSeo.image || null;
    let ogImages = undefined;
    if (seoImage?.path) {
      const path = seoImage.path;
      const normalizeAssetPath = (val) => {
        if (!val) return "";
        const p = String(val).trim();
        if (/^https?:\/\//.test(p)) return p;
        const clean = p.replace(/^\/+/, "");
        if (clean.startsWith("storage/")) return `/${clean}`;
        if (clean.startsWith("uploads/")) return `/storage/${clean}`;
        return `/storage/uploads/${clean}`;
      };

      const toOrigin = (url) => {
        if (!url) return "";
        try {
          return new URL(url).origin;
        } catch {
          return url.replace(/\/api(?:\/.*)?$/, "").replace(/\/$/, "");
        }
      };

      const origin = toOrigin(process.env.COCKPIT_API_URL || "");
      const normalizedPath = normalizeAssetPath(path);
      const imageUrl = origin ? `${origin}${normalizedPath}` : normalizedPath;
      ogImages = [{ url: imageUrl, width: seoImage.width, height: seoImage.height, alt: seoImage.title || seoImage.altText }];
    }

    const noindex = pageSeo.noindex !== undefined ? pageSeo.noindex : siteSeo.noindex;
    const nofollow = pageSeo.nofollow !== undefined ? pageSeo.nofollow : siteSeo.nofollow;

    const robots = noindex !== undefined || nofollow !== undefined ? {
      index: noindex === true ? false : noindex === false ? true : undefined,
      follow: nofollow === true ? false : nofollow === false ? true : undefined,
    } : undefined;

    return {
      title,
      description,
      keywords,
      robots,
      openGraph: ogImages ? { images: ogImages } : undefined,
      icons: settings.favicon_url ? {
        icon: settings.favicon_url,
        shortcut: settings.favicon_url,
        apple: settings.favicon_url,
      } : undefined,
    };
  } catch (err) {
    console.error("Failed to generate slug metadata:", err);
    return {};
  }
}

export default async function DynamicPage({ params, searchParams }) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { isEnabled: preview } = await draftMode();
  const slugPath = slug.join("/");
  const resolvedSearchParams = await searchParams;
  const pageQuery = resolvedSearchParams?.page;
  const page = await getPageBySlug({ locale, slug: slugPath, preview, page: pageQuery });

  if (!page) {
    notFound();
  }

  if (page.type === "collection") {
    let latestProjects = [];
    if (page.data?.item) {
      const response = await getItems("projects", {
        locale,
        limit: 4,
        sort: { _created: -1 },
        populate: 1,
        preview,
      }).catch(() => null);

      if (response) {
        const items = Array.isArray(response) ? response : Array.isArray(response.items) ? response.items : [];
        latestProjects = items
          .filter((p) => p && p._id !== page.data.item._id)
          .slice(0, 3);
      }
    }

    return <CockpitCollectionPage page={page} locale={locale} latestProjects={latestProjects} />;
  }

  const layoutComponents = Array.isArray(page.layout)
    ? page.layout
    : Array.isArray(page.content)
      ? page.content
      : Array.isArray(page.body)
        ? page.body
        : [];

  if (layoutComponents.length) {
    return <LayoutRenderer components={layoutComponents} locale={locale} />;
  }

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{page.title || slugPath}</h1>
        {page.excerpt ? <p className="max-w-3xl text-base opacity-80">{page.excerpt}</p> : null}
      </header>

      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: page.content || page.body || "" }}
      />
    </article>
  );
}
