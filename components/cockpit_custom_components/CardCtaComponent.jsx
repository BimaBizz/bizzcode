import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Extract clean URL from markdown link, full URL, or plain string
 */
function parseButtonUrl(rawUrl, locale) {
  if (!rawUrl) return localePath(locale, "/contact");

  let href = "";
  if (typeof rawUrl === "string") {
    const trimmed = rawUrl.trim();
    const markdownMatch = trimmed.match(/^\[(.*?)\]\((.*?)\)$/);
    if (markdownMatch) {
      href = markdownMatch[2].trim();
    } else {
      href = trimmed;
    }
  } else if (typeof rawUrl === "object") {
    href = rawUrl.url || rawUrl.href || "";
  }

  // Extract relative pathname if full URL
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      const parsed = new URL(href);
      if (parsed.pathname) {
        href = parsed.pathname;
      }
    }
  } catch (e) {
    // Keep href as is
  }

  if (!href) return localePath(locale, "/contact");
  return href.startsWith("/") ? localePath(locale, href) : href;
}

export default function CardCtaComponent({ data, locale, className }) {
  if (!data) return null;

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const desc = typeof data.desc === "string" ? data.desc.trim() : (typeof data.description === "string" ? data.description.trim() : "");
  
  const button = data.button || {};
  const buttonText = button.text_cta || button.text || button.label || button.caption || "Discuss a project";
  const buttonUrl = parseButtonUrl(button.url || button.link, locale);

  const isHtmlDesc = desc.includes("<") && desc.includes(">");

  return (
    <article
      className={cn(
        "w-full bg-[#121212] border border-[#27272A] rounded-xl p-6 sm:p-8 md:p-10 shadow-xl flex flex-col justify-between my-4 transition-all duration-200",
        className
      )}
    >
      <div className="max-w-2xl">
        {title && (
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
            {title}
          </h3>
        )}

        {desc && (
          isHtmlDesc ? (
            <div
              className="mt-3 text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-normal [&_p]:my-0"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          ) : (
            <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] leading-relaxed font-normal">
              {desc}
            </p>
          )
        )}
      </div>

      <div className="mt-6 sm:mt-8">
        <Link
          href={buttonUrl}
          className="inline-flex items-center justify-center font-medium px-6 py-2.5 rounded-lg text-xs sm:text-sm bg-[#E8452C] hover:bg-[#d43c24] text-white shadow-sm transition-all duration-200 active:scale-95 w-fit"
        >
          {buttonText}
        </Link>
      </div>
    </article>
  );
}
