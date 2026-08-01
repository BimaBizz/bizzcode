import { fetchSitemap } from "@/lib/pro/pages";
import { LOCALES, DEFAULT_LOCALE, COCKPIT_MULTI_LANGUAGE_ENABLED } from "@/config/cockpit";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://bmdev.co.id";

  try {
    const rawSitemap = await fetchSitemap({ deep: 3 }).catch(() => []);
    if (!Array.isArray(rawSitemap)) {
      return [];
    }

    const sitemapEntries = [];

    rawSitemap.forEach((entry) => {
      if (!entry || !entry.routes) return;

      Object.entries(entry.routes).forEach(([lang, path]) => {
        if (!path) return;

        // Check if this route has noindex configured
        const isNoIndex = Array.isArray(entry.noindex)
          ? entry.noindex.includes(lang) || entry.noindex.includes("default")
          : entry.noindex === true;

        if (isNoIndex) return;

        const cleanPath = path.replace(/\/$/, ""); // remove trailing slash

        // If multi-language is enabled in env, generate for locales.
        // Otherwise, only use the default locale.
        const localesToGenerate = COCKPIT_MULTI_LANGUAGE_ENABLED
          ? (lang === "default" ? LOCALES : [lang])
          : [DEFAULT_LOCALE];

        localesToGenerate.forEach((locale) => {
          const routePath = COCKPIT_MULTI_LANGUAGE_ENABLED
            ? (cleanPath === "" || cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`)
            : (cleanPath === "" || cleanPath === "/" ? "" : cleanPath);
          
          sitemapEntries.push({
            url: `${baseUrl}${routePath}`,
            lastModified: entry.lastmod ? new Date(entry.lastmod) : new Date(),
          });
        });
      });
    });

    return sitemapEntries;
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return [];
  }
}
