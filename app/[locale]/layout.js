import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { COCKPIT_MULTI_LANGUAGE_ENABLED, LOCALES } from "@/config/cockpit";
import { PRO_PAGES_ENABLED } from "@/config/cockpit";
import { getNavigation, getSiteSettings, getMenuByName } from "@/lib/cockpit-queries";
import { isSupportedLocale, localePath } from "@/lib/i18n";
import HeaderNavigation from "@/components/header-navigation";
import ChatBubble from "@/components/chat-bubble";


// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
// export const instant = false;


function flattenNavigation(items = []) {
  return items.flatMap((item) => {
    const current = {
      _id: item._id || item.title,
      title: item.title || item.name,
      slug: item.slug || item.path || item.route || item.url,
    };

    if (Array.isArray(item.children) && item.children.length) {
      return [current, ...flattenNavigation(item.children)];
    }

    return [current];
  });
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { isEnabled: preview } = await draftMode();
  const [settings, menuTree, socialMenu] = await Promise.all([
    getSiteSettings({ locale, preview }),
    getNavigation({ locale, preview }),
    getMenuByName("sosialMedia", { locale, preview }),
  ]);

  const menuItems = flattenNavigation(menuTree).filter(
    (item) => item.title && item.slug,
  );

  const socialItems = Array.isArray(socialMenu) && socialMenu.length > 0
    ? socialMenu.map((item) => ({
      label: item.title || item.name || "",
      href: item.url || item.route || item.path || item.slug || "#",
    })).filter((item) => item.label)
    : [
      { label: "GITHUB", href: settings.social_links?.github || "https://github.com" },
      { label: "LINKEDIN", href: settings.social_links?.linkedin || "https://linkedin.com" },
      { label: "TWITTER", href: settings.social_links?.twitter || "https://twitter.com" },
      { label: "EMAIL", href: settings.social_links?.email ? `mailto:${settings.social_links.email}` : "mailto:contact@architect-atelier.com" },
    ];


  return (
    <div className="min-h-screen text-foreground relative z-10 bg-transparent">
      <main className="mx-auto w-full px-4 bg-transparent">
        <HeaderNavigation
          menuTree={menuTree}
          locale={locale}
          siteTitle={settings.site_title || "BMDev"}
          logoUrl={settings.logo_url}
          locales={LOCALES}
          multiLanguageEnabled={COCKPIT_MULTI_LANGUAGE_ENABLED}
          preview={preview}
        />
        {children}
      </main>
      <ChatBubble />
      <footer className="w-full px-6 py-12 mt-16 border-t border-[#27272A]/80">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {settings.site_title || "BMDev"}.</span>
            <span className="text-[#3F3F46]">/</span>
            <span className="font-mono text-[#71717A]">Fullstack Web Developer</span>
          </div>

          <nav className="flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-wider">
            {socialItems.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="text-[#A1A1AA] hover:text-[#E8452C] transition-colors uppercase"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
