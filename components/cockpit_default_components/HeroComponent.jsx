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
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#111111] text-[#F3EEE3] border border-[#111111]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          Available for Projects
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#FAF7F0] text-[#57534E] border border-[#111111]/15">
          Surabaya, ID
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 rounded-md bg-[#FAF7F0] text-[#57534E] border border-[#111111]/15">
          Next.js × TypeScript
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#111111] leading-[1.05]">
        {headline ? (
          <span dangerouslySetInnerHTML={{ __html: headline.replace(/<em>/g, '<em class="not-italic text-[#D9541E] font-bold">') }} />
        ) : (
          <>
            Crafting digital <em className="not-italic text-[#D9541E] font-bold">masterpieces</em>, one system at a time.
          </>
        )}
      </h1>

      {/* Subheadline */}
      {subheadline ? (
        <p className="text-base md:text-lg leading-relaxed text-[#57534E] max-w-xl font-normal">
          {subheadline}
        </p>
      ) : null}

      {/* CTAs */}
      {ctaUrl ? (
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href={toLocalHref(ctaUrl, locale)}
            className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-lg text-xs bg-[#D9541E] hover:bg-[#BF4615] text-[#F3EEE3] shadow-md shadow-[#D9541E]/20 transition-all duration-200 active:scale-95"
          >
            {ctaText}
          </Link>
          <Link
            href={toLocalHref("/contact", locale)}
            className="inline-flex items-center justify-center font-medium px-6 py-3 rounded-lg text-xs bg-[#111111] hover:bg-[#262626] border border-[#111111] text-[#F3EEE3] transition-all duration-200 active:scale-95"
          >
            Hire Me
          </Link>
        </div>
      ) : null}
    </div>
  );
}
