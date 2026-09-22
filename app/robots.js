export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://bmdev.web.id";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/draft/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
