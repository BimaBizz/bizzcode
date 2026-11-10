"use client";

import { useState } from "react";
import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { BMDevMark, BMDevWordmark } from "@/components/ui/bmdev-logo";

function DesktopMenuItem({ item, locale }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const href = item.url || item.path || item.route || item.slug || "#";
  const path = href.startsWith("/") ? href : `/${href}`;
  const localizedPath = localePath(locale, path);

  return (
    <div className="relative group">
      <div className="flex items-center gap-1">
        <Link
          href={localizedPath}
          className="font-medium text-[#57534E] hover:text-[#111111] hover:bg-[#EBE4D5] transition-all py-1.5 px-3.5 rounded-lg text-sm"
        >
          {item.title || item.name}
        </Link>
        {hasChildren && (
          <span className="text-[#57534E] group-hover:text-[#111111] transition-colors cursor-pointer select-none pr-1">
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}
      </div>

      {hasChildren && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[#111111]/15 bg-[#FAF7F0]/95 backdrop-blur-xl shadow-xl p-1.5 hidden group-hover:block transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-1">
          {item.children.map((child, idx) => (
            <DesktopDropdownItem key={child.title || idx} item={child} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopDropdownItem({ item, locale }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const href = item.url || item.path || item.route || item.slug || "#";
  const path = href.startsWith("/") ? href : `/${href}`;
  const localizedPath = localePath(locale, path);

  return (
    <div className="relative group/sub">
      <Link
        href={localizedPath}
        className="flex items-center justify-between w-full font-medium text-xs text-[#57534E] hover:text-[#111111] transition-all py-2 px-3 rounded-md hover:bg-[#EBE4D5]"
      >
        <span>{item.title || item.name}</span>
        {hasChildren && (
          <svg
            className="w-3 h-3 text-[#57534E] group-hover/sub:text-[#111111] transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>

      {hasChildren && (
        <div className="absolute top-0 left-full ml-1.5 w-56 rounded-xl border border-[#111111]/15 bg-[#FAF7F0]/95 backdrop-blur-xl shadow-xl p-1.5 hidden group-hover/sub:block transition-all duration-200 z-50 animate-in fade-in slide-in-from-left-1">
          {item.children.map((child, idx) => (
            <DesktopDropdownItem key={child.title || idx} item={child} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenuItem({ item, locale, depth = 0, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const href = item.url || item.path || item.route || item.slug || "#";
  const path = href.startsWith("/") ? href : `/${href}`;
  const localizedPath = localePath(locale, path);

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between w-full py-2">
        <Link
          href={localizedPath}
          onClick={onClose}
          className="text-sm font-medium text-[#111111] hover:text-[#D9541E] transition-colors"
          style={{ paddingLeft: `${depth * 14}px` }}
        >
          {item.title || item.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-[#57534E] hover:text-[#111111] transition-colors focus:outline-none"
          >
            <svg
              className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="space-y-1 border-l border-[#111111]/15 ml-3 pl-2">
          {item.children.map((child, idx) => (
            <MobileMenuItem
              key={child.title || idx}
              item={child}
              locale={locale}
              depth={depth + 1}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeaderNavigation({
  menuTree = [],
  locale,
  siteTitle = "BMDev",
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = Array.isArray(menuTree)
    ? menuTree.filter((item) => item && item.active !== false)
    : [];

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4">
      <div className="flex w-full items-center justify-between gap-6 px-4 py-2.5 rounded-2xl bg-[#FAF7F0]/90 border border-[#111111]/15 shadow-lg backdrop-blur-xl">
        {/* Brand Mark */}
        <Link
          href={localePath(locale)}
          className="flex items-center gap-3 text-[#111111] transition-all group"
          aria-label={siteTitle || "BMDev"}
        >
          <div className="w-9 h-9 rounded-lg bg-[#111111] border border-[#111111] shadow-[2px_2px_0px_#D9541E] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_#D9541E] transition-all duration-200 flex items-center justify-center p-1.5 text-[#F3EEE3]">
            <BMDevMark className="w-6 h-6 text-[#F3EEE3]" />
          </div>
          <BMDevWordmark className="h-4 w-auto text-[#111111]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((item, idx) => (
            <DesktopMenuItem key={item.title || idx} item={item} locale={locale} />
          ))}
        </nav>

        {/* Desktop Controls (Hire Me) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={localePath(locale, "/contact")}
            className="inline-flex items-center justify-center bg-[#D9541E] hover:bg-[#BF4615] text-white font-semibold text-xs px-5 py-2 rounded-lg transition-all duration-200 active:scale-95 shadow-sm shadow-[#D9541E]/20"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#57534E] hover:text-[#111111] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "absolute top-full left-4 right-4 mt-2 md:hidden rounded-2xl bg-[#FAF7F0]/95 border border-[#111111]/15 shadow-2xl p-5 z-50 backdrop-blur-xl transition-all duration-200 origin-top",
          mobileMenuOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        )}
      >
        <div className="divide-y divide-[#111111]/10">
          {links.map((item, idx) => (
            <div key={item.title || idx} className="py-2.5 first:pt-0 last:pb-0">
              <MobileMenuItem
                item={item}
                locale={locale}
                onClose={() => setMobileMenuOpen(false)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[#111111]/15">
          <Link
            href={localePath(locale, "/contact")}
            onClick={() => setMobileMenuOpen(false)}
            className="w-full inline-flex items-center justify-center font-semibold text-xs py-2.5 px-4 rounded-lg bg-[#D9541E] hover:bg-[#BF4615] text-white transition-colors text-center"
          >
            Hire Me
          </Link>
        </div>
      </div>
    </header>
  );
}
