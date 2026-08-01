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
    <div className="py-16 md:py-24 max-w-4xl space-y-7">
      <div className="flex flex-wrap gap-2.5">
        <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-[16px] uppercase tracking-wider bg-[#0F3D24] text-[#B9F5D0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
          Available for Projects
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-[16px] uppercase tracking-wider bg-[#0B3B36] text-[#B0F5EC]">
          Surabaya, ID
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-[16px] uppercase tracking-wider bg-[#3D3410] text-[#FBEFB8]">
          Next.js × Cockpit CMS
        </div>
      </div>

      <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-[#EAF6EF] leading-[0.98]">
        {headline ? (
          <span dangerouslySetInnerHTML={{ __html: headline.replace(/<em>/g, '<em class="italic font-normal text-[#4ADE80]">') }} />
        ) : (
          <>
            Crafting digital <em className="italic font-normal text-[#4ADE80]">masterpieces</em>, one system at a time.
          </>
        )}
      </h1>

      {subheadline ? (
        <p className="text-lg md:text-xl leading-relaxed text-[#8FAB9C] max-w-xl font-normal">
          {subheadline}
        </p>
      ) : null}

      {ctaUrl ? (
        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            href={toLocalHref(ctaUrl, locale)}
            className="inline-flex items-center justify-center font-bold px-7 py-4 rounded-[22px] hover:rounded-[10px] text-sm bg-[#4ADE80] !text-[#062011] transition-all duration-350 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-[1.04] active:scale-[0.97]"
          >
            {ctaText}
          </Link>
          <Link
            href={toLocalHref("/contact", locale)}
            className="inline-flex items-center justify-center font-semibold px-7 py-4 rounded-[22px] hover:rounded-[10px] text-sm bg-[#152B21] border border-[#1E3A2C] text-[#EAF6EF] transition-all duration-350 ease-[cubic-bezier(.34,1.56,.64,1)] hover:bg-[#0B3B36]"
          >
            Hire Me
          </Link>
        </div>
      ) : null}
    </div>
  );
}
