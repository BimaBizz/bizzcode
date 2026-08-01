const parseList = (value, fallback) => {
  if (!value) return fallback;

  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items : fallback;
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
};

const parseLocaleMap = (value) => {
  if (!value) return {};

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const [from, to] = entry.split(":").map((part) => part?.trim());
      if (from && to) acc[from] = to;
      return acc;
    }, {});
};

export const COCKPIT_API_URL = process.env.COCKPIT_API_URL?.replace(/\/$/, "") || "";
export const COCKPIT_API_KEY = process.env.COCKPIT_API_KEY || "";
export const COCKPIT_PREVIEW_API_KEY = process.env.COCKPIT_PREVIEW_API_KEY || COCKPIT_API_KEY;

export const LOCALES = parseList(process.env.COCKPIT_LOCALES, ["id", "en"]);
export const DEFAULT_LOCALE = process.env.COCKPIT_DEFAULT_LOCALE || LOCALES[0] || "id";

export const MODELS = {
  posts: process.env.COCKPIT_MODEL_POSTS || "posts",
  pages: process.env.COCKPIT_MODEL_PAGES || "pages",
  siteSettings: process.env.COCKPIT_MODEL_SITE_SETTINGS || "site_settings",
  menus: process.env.COCKPIT_MODEL_MENUS || "menus",
};

export const WEBHOOK_SECRET = process.env.COCKPIT_WEBHOOK_SECRET || "";
export const PREVIEW_SECRET = process.env.COCKPIT_PREVIEW_SECRET || "";

export const PRO_PAGES_ENABLED = parseBoolean(process.env.COCKPIT_PRO_PAGES_ENABLED, false);
export const PRO_PAGES_DEFAULT_MENU = process.env.COCKPIT_PRO_PAGES_DEFAULT_MENU || "main";

export const COCKPIT_MULTI_LANGUAGE_ENABLED = parseBoolean(
  process.env.NEXT_PUBLIC_COCKPIT_MULTI_LANGUAGE_ENABLED !== undefined
    ? process.env.NEXT_PUBLIC_COCKPIT_MULTI_LANGUAGE_ENABLED
    : process.env.COCKPIT_MULTI_LANGUAGE_ENABLED,
  true
);
export const COCKPIT_DEFAULT_API_LOCALE = process.env.COCKPIT_DEFAULT_API_LOCALE || "";
export const COCKPIT_LOCALE_MAP = parseLocaleMap(process.env.COCKPIT_LOCALE_MAP);

export const PRO_DETEKTIVO_ENABLED = parseBoolean(process.env.COCKPIT_PRO_DETEKTIVO_ENABLED, false);
export const PRO_PERSONI_ENABLED = parseBoolean(process.env.COCKPIT_PRO_PERSONI_ENABLED, false);
