import { NextResponse } from "next/server";

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
};

const LOCALES = (process.env.COCKPIT_LOCALES || "id,en")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const DEFAULT_LOCALE = process.env.COCKPIT_DEFAULT_LOCALE || LOCALES[0] || "id";
const MULTI_LANGUAGE_ENABLED = parseBoolean(process.env.COCKPIT_MULTI_LANGUAGE_ENABLED, true);

const isStaticAsset = (pathname) => /\.[^/]+$/.test(pathname);

export function proxy(request) {
  if (MULTI_LANGUAGE_ENABLED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    isStaticAsset(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return NextResponse.next();
  }

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;

  return NextResponse.rewrite(rewrittenUrl);
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
