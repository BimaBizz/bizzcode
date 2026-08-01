import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import CockpitImage from "@/components/cockpit-image";
import { LOCALES } from "@/config/cockpit";
import { getAllPostSlugs, getPostBySlug } from "@/lib/cockpit-queries";
import { isSupportedLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  const allParams = await Promise.all(
    LOCALES.map(async (locale) => {
      const slugs = await getAllPostSlugs({ locale }).catch(() => []);
      return slugs.map((slug) => ({ locale, slug }));
    })
  );

  return allParams.flat();
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) return {};

  const post = await getPostBySlug({ locale, slug }).catch(() => null);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}

export default async function BlogDetailPage({ params }) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { isEnabled: preview } = await draftMode();
  const post = await getPostBySlug({ locale, slug, preview });

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">{post.title}</h1>
        {post.excerpt ? <p className="max-w-3xl text-base opacity-80">{post.excerpt}</p> : null}
      </header>

      <CockpitImage
        asset={post.featured_image}
        alt={post.title}
        width={1400}
        height={800}
        className="h-auto w-full rounded-xl border border-border object-cover"
      />

      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </article>
  );
}
