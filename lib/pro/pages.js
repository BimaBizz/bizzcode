import { cockpitRequest } from "@/lib/cockpit";

const normalizeRoute = (route) => {
  if (!route || route === "/") return "/";
  const normalized = String(route).replace(/^\/+|\/+$/g, "");
  return `/${normalized}`;
};

export const fetchMenus = ({ locale, preview = false, next } = {}) =>
  cockpitRequest("/pages/menus", {
    query: { locale },
    preview,
    next,
  });

export const fetchMenu = (name, { locale, preview = false, next } = {}) => {
  if (!name) throw new Error("Menu name is required");

  return cockpitRequest(`/pages/menu/${name}`, {
    query: { locale },
    preview,
    next,
  });
};

export const fetchPagesTree = ({ locale, filter, sort, fields, limit, skip, preview = false, next } = {}) =>
  cockpitRequest("/pages/pages", {
    query: { locale, filter, sort, fields, limit, skip },
    preview,
    next,
  });

export const fetchPageByRoute = ({ route, locale, personi, personiVars, tzOffset, preview = false, next, skip, limit } = {}) => {
  if (!route) throw new Error("Page route is required");

  return cockpitRequest("/pages/page", {
    query: {
      route: normalizeRoute(route),
      locale,
      personi,
      personi_vars: personiVars,
      tz_offset: tzOffset,
      skip,
      limit,
    },
    preview,
    next,
  });
};

export const fetchPageById = (id, { locale, preview = false, next } = {}) => {
  if (!id) throw new Error("Page id is required");

  return cockpitRequest(`/pages/page/${id}`, {
    query: { locale },
    preview,
    next,
  });
};

export const fetchRoutes = ({ locale, preview = false, next } = {}) =>
  cockpitRequest("/pages/routes", {
    query: { locale },
    preview,
    next,
  });

export const fetchPagesSettings = ({ locale, preview = false, next } = {}) =>
  cockpitRequest("/pages/settings", {
    query: { locale },
    preview,
    next,
  });

export const fetchSitemap = ({ locale, preview = false, next, deep } = {}) =>
  cockpitRequest("/pages/sitemap", {
    query: { locale, deep },
    preview,
    next,
  });
