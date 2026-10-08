import Link from "next/link";
import { COCKPIT_MULTI_LANGUAGE_ENABLED } from "@/config/cockpit";

const toLocalHref = (url, locale) => {
  if (!url) return "#";
  if (!url.startsWith("/") || !locale || !COCKPIT_MULTI_LANGUAGE_ENABLED) return url;
  return `/${locale}${url === "/" ? "" : url}`;
};

export default function HeroComponent({ data, locale }) {
  const headline = data?.headline || "";
  const subheadline = data?.subheadline || "";
  const ctaUrl = data?.cta_url || "";
  const ctaText = data?.cta_text || "Lihat Karya →";

  return (
    <div className="py-12 md:py-20 max-w-4xl space-y-6">
      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#181818] text-[#FAFAFA] border border-[#27272A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          Available for Projects
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#181818] text-[#A1A1AA] border border-[#27272A]">
          Surabaya, ID
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#181818] text-[#A1A1AA] border border-[#27272A]">
          Next.js × TypeScript
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAFAFA] leading-[1.05]">
        {headline ? (
          <span dangerouslySetInnerHTML={{ __html: headline.replace(/<em>/g, '<em class="not-italic text-[#E8452C] font-bold">') }} />
        ) : (
          <>
            Crafting digital <em className="not-italic text-[#E8452C] font-bold">masterpieces</em>, one system at a time.
          </>
        )}
      </h1>

      {/* Subheadline */}
      {subheadline ? (
        <p className="text-base md:text-lg leading-relaxed text-[#A1A1AA] max-w-xl font-normal">
          {subheadline}
        </p>
      ) : null}

      {/* CTAs */}
      {ctaUrl ? (
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href={toLocalHref(ctaUrl, locale)}
            className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-lg text-xs bg-[#E8452C] hover:bg-[#d43c24] text-white shadow-md shadow-[#E8452C]/20 transition-all duration-200 active:scale-95"
          >
            {ctaText}
          </Link>
          <Link
            href={toLocalHref("/contact", locale)}
            className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-lg text-xs bg-[#181818] hover:bg-[#202020] border border-[#27272A] text-[#FAFAFA] transition-all duration-200 active:scale-95"
          >
            Hire Me
          </Link>
        </div>
      ) : null}
    </div>
  );
}
