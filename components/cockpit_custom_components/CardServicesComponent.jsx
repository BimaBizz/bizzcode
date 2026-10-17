"use client";

import { useState } from "react";
import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Format slug into human-readable title (e.g. "pt-magna-aneka-sumber" -> "PT Magna Aneka Sumber")
 */
function formatSlugToTitle(slug) {
  if (!slug) return "";
  return slug
    .split(/[-_]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "pt") return "PT";
      if (lower === "erp") return "ERP";
      if (lower === "n") return "&";
      if (lower === "ui") return "UI";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Parse markdown link, URL, or string into { href, title }
 */
function parseServiceSample(sample, locale) {
  if (!sample) return null;

  let label = "";
  let href = "";

  if (typeof sample === "string") {
    const trimmed = sample.trim();
    const markdownMatch = trimmed.match(/^\[(.*?)\]\((.*?)\)$/);
    if (markdownMatch) {
      label = markdownMatch[1].trim();
      href = markdownMatch[2].trim();
    } else {
      label = trimmed;
      href = trimmed;
    }
  } else if (typeof sample === "object") {
    href = sample.url || sample.href || "";
    label = sample.label || sample.title || href;
  }

  if (!href) return null;

  // If href is full absolute URL (e.g. http://localhost:8080/projects/...), extract pathname
  try {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      const parsed = new URL(href);
      if (parsed.pathname) {
        href = parsed.pathname;
      }
    }
  } catch (e) {
    // Keep href as-is if URL parsing fails
  }

  const finalHref = href.startsWith("/") ? localePath(locale, href) : href;

  // Determine display label
  let displayTitle = label;
  if (displayTitle.startsWith("/") || displayTitle.startsWith("http")) {
    const pathOnly = displayTitle.replace(/^https?:\/\/[^/]+/, "").replace(/^\/?(projects\/)?/, "");
    if (pathOnly.includes("-for-")) {
      const companyPart = pathOnly.split("-for-")[1];
      displayTitle = formatSlugToTitle(companyPart);
    } else {
      displayTitle = formatSlugToTitle(pathOnly);
    }
  }

  return {
    href: finalHref,
    title: displayTitle || "Project Details",
  };
}

/**
 * Clean WYSIWYG HTML by removing empty trailing paragraphs or whitespace from Cockpit CMS
 */
function cleanWysiwygHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<p>\s*(?:&nbsp;|<br\s*\/?>)?\s*<\/p>/gi, "")
    .replace(/(?:&nbsp;|\s)+$/gi, "")
    .trim();
}

export default function CardServicesComponent({ data, locale }) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) {
    return null;
  }

  const safeIndex = activeIndex >= 0 && activeIndex < items.length ? activeIndex : 0;
  const activeItem = items[safeIndex];

  const quoteHref = localePath(locale, data?.quoteUrl || "/contact");
  const quoteLabel = data?.quoteLabel || "Request a quote";
  const sampleLink = parseServiceSample(activeItem?.serviceSample, locale);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 lg:gap-10 items-start my-4">
      {/* Left Sidebar: Service Navigation List */}
      <nav
        aria-label="Services List"
        className="w-full md:w-64 lg:w-72 shrink-0 border-l border-[#27272A] relative flex flex-row md:flex-col overflow-x-auto md:overflow-visible no-scrollbar py-1"
      >
        {items.map((item, index) => {
          const isActive = index === safeIndex;
          const serviceName = item?.serviceName || `Service ${index + 1}`;

          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative text-left py-2.5 px-4 md:px-5 text-sm transition-all duration-200 select-none whitespace-nowrap md:whitespace-normal shrink-0 md:shrink border-l-2 -ml-[1px]",
                isActive
                  ? "border-[#E8452C] text-[#FAFAFA] font-medium"
                  : "border-transparent text-[#71717A] hover:text-[#D4D4D8]"
              )}
            >
              <span className="block leading-snug">
                {serviceName}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right Column: Active Service Card (rounded-xl, border-[#27272A], p-6 md:p-8) */}
      <article className="flex-1 w-full bg-[#121212] border border-[#27272A] rounded-xl p-6 md:p-8 shadow-xl flex flex-col justify-between transition-all duration-200">
        <div key={safeIndex} className="animate-in fade-in duration-200 flex flex-col justify-between h-full">
          <div>
            {/* Header: Title and Description */}
            <div className="flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#FAFAFA]">
                {activeItem?.serviceName}
              </h3>

              {activeItem?.serviceDesc && (
                <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed mt-1 font-normal">
                  {activeItem.serviceDesc}
                </p>
              )}
            </div>

            {/* Service Content: Rendered via @tailwindcss/typography (prose) */}
            {activeItem?.serviceContent && (
              <div
                className="prose prose-sm prose-invert max-w-none mt-6
                  prose-headings:text-sm prose-headings:font-semibold prose-headings:text-[#FAFAFA] prose-ul:mt-3 prose-headings:tracking-tight prose-headings:mt-0 prose-headings:mb-3
                  prose-p:my-0 prose-p:text-xs sm:prose-p:text-sm prose-p:text-[#D4D4D8] prose-p:leading-relaxed
                  prose-ul:pl-4 
                  prose-li:text-xs sm:prose-li:text-sm prose-li:text-[#D4D4D8]
                  marker:text-[#E8452C] prose-li:marker:text-[#E8452C]"
                dangerouslySetInnerHTML={{ __html: cleanWysiwygHtml(activeItem.serviceContent) }}
              />
            )}

            {/* Technology Badges */}
            {Array.isArray(activeItem?.serviceTech) && activeItem.serviceTech.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-[#FAFAFA] tracking-tight mb-3">
                  Technology
                </h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  {activeItem.serviceTech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-[#181818] text-[#FAFAFA] border border-[#27272A] font-mono text-xs px-2.5 py-1 rounded-md hover:border-[#3F3F46] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions: Quote Button & Sample Link */}          <div className="mt-8 pt-4 border-t border-[#27272A] flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href={quoteHref}
              className="inline-flex items-center justify-center font-medium px-5 py-2.5 rounded-lg text-xs sm:text-sm bg-[#E8452C] hover:bg-[#d43c24] text-white shadow-sm transition-all duration-200 active:scale-95"
            >
              {quoteLabel}
            </Link>

            {sampleLink && (
              <div className="text-xs sm:text-sm text-[#A1A1AA] flex items-center gap-1.5 flex-wrap">
                <span>See an example:</span>
                <Link
                  href={sampleLink.href}
                  className="underline text-[#FAFAFA] hover:text-[#E8452C] transition-colors font-medium decoration-1 underline-offset-4"
                >
                  {sampleLink.title}
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
