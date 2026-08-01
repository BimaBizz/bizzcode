"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
          className="font-medium text-[#8FAB9C] hover:text-[#B9F5D0] hover:bg-[#0F3D24] transition-all py-2 px-4 rounded-2xl text-sm"
        >
          {item.title || item.name}
        </Link>
        {hasChildren && (
          <span className="text-[#8FAB9C] group-hover:text-[#B9F5D0] transition-colors cursor-pointer select-none pr-1">
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}
      </div>

      {hasChildren && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0F221A]/95 backdrop-blur-2xl shadow-2xl p-2 hidden group-hover:block transition-all duration-300 z-50 animate-in fade-in slide-in-from-top-2">
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
        className="flex items-center justify-between w-full font-medium text-sm text-[#8FAB9C] hover:text-[#B9F5D0] transition-all py-2.5 px-4 rounded-xl hover:bg-[#0F3D24]"
      >
        <span>{item.title || item.name}</span>
        {hasChildren && (
          <svg
            className="w-3.5 h-3.5 text-[#8FAB9C] group-hover/sub:text-[#B9F5D0] group-hover/sub:translate-x-0.5 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>

      {hasChildren && (
        <div className="absolute top-0 left-full ml-2 w-56 rounded-2xl border border-white/10 bg-[#0F221A]/95 backdrop-blur-2xl shadow-2xl p-2 hidden group-hover/sub:block transition-all duration-300 z-50 animate-in fade-in slide-in-from-left-2">
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
      <div className="flex items-center justify-between w-full py-1.5">
        <Link
          href={localizedPath}
          onClick={onClose}
          className="text-base font-medium text-[#EAF6EF] hover:text-[#4ADE80] transition-colors"
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          {item.title || item.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#8FAB9C] hover:text-[#4ADE80] transition-colors focus:outline-none"
          >
            <svg
              className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="space-y-1 border-l border-[#1E3A2C] ml-4 pl-2">
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
  siteTitle = "Cockpit Site",
  logoUrl = "",
  locales = [],
  multiLanguageEnabled = false,
  preview = false,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = Array.isArray(menuTree)
    ? menuTree.filter((item) => item && item.active !== false)
    : [];

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4">
      <div
        className="flex w-full items-center justify-between gap-6 px-5 py-2.5 rounded-[28px] bg-[rgba(15,34,26,0.65)] border border-white/10 shadow-2xl backdrop-blur-[24px] saturate-[160%]"
      >
        {/* Logo Mark */}
        <Link
          href={localePath(locale)}
          className="flex items-center gap-2.5 font-bold tracking-tight text-[#EAF6EF] text-lg hover:opacity-90 transition-all group"
        >
          <div className="w-9 h-9 bg-[#4ADE80] text-[#062011] rounded-tl-[50%] rounded-tr-[50%] rounded-br-[50%] rounded-bl-[4px] flex items-center justify-center font-heading font-extrabold text-lg transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:rounded-tl-[4px] group-hover:rounded-tr-[50%] group-hover:rounded-br-[50%] group-hover:rounded-bl-[50%]">
            B
          </div>
          <span className="font-heading font-semibold text-xl">{siteTitle}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((item, idx) => (
            <DesktopMenuItem key={item.title || idx} item={item} locale={locale} />
          ))}
        </nav>

        {/* Desktop Controls (Hire Me) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={localePath(locale, "/contact")}
            className="btn-pill bg-[#4ADE80] hover:bg-[#3bc770] !text-[#062011] font-bold text-xs px-6 py-2.5 rounded-[22px] hover:rounded-[10px] transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-105 active:scale-95 shadow-md shadow-[#4ADE80]/10"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#EAF6EF] hover:text-[#4ADE80] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="absolute top-full left-4 right-4 mt-3 md:hidden rounded-[28px] bg-[#0F221A]/95 border border-white/10 shadow-2xl p-6 space-y-6 z-50 animate-in fade-in slide-in-from-top-4 backdrop-blur-2xl"
        >
          <div className="space-y-3 divide-y divide-white/5">
            {links.map((item, idx) => (
              <div key={item.title || idx} className="pt-2 first:pt-0">
                <MobileMenuItem
                  item={item}
                  locale={locale}
                  onClose={() => setMobileMenuOpen(false)}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <Link
              href={localePath(locale, "/contact")}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center font-bold text-sm py-3 px-5 rounded-[22px] bg-[#4ADE80] !text-[#062011] transition-all text-center cursor-pointer"
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
