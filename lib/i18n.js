import { COCKPIT_MULTI_LANGUAGE_ENABLED, DEFAULT_LOCALE, LOCALES } from "@/config/cockpit";

export const isSupportedLocale = (locale) => LOCALES.includes(locale);

export const normalizeLocale = (locale) => {
  if (isSupportedLocale(locale)) return locale;
  return DEFAULT_LOCALE;
};

export const localePath = (locale, path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!COCKPIT_MULTI_LANGUAGE_ENABLED) {
    return normalizedPath === "/" ? "/" : normalizedPath;
  }

  const normalizedLocale = normalizeLocale(locale);
  return `/${normalizedLocale}${normalizedPath === "/" ? "" : normalizedPath}`;
};
