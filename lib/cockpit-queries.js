import { MODELS, PRO_PAGES_DEFAULT_MENU, PRO_PAGES_ENABLED, COCKPIT_API_URL } from "@/config/cockpit";
import { getItems, getSingleton, getTree } from "@/lib/cockpit";
import { fetchMenu, fetchPageByRoute, fetchRoutes, fetchPagesSettings } from "@/lib/pro/pages";

const toOrigin = (apiUrl) => {
  if (!apiUrl) return "";
  try {
    return new URL(apiUrl).origin;
  } catch {
    return apiUrl.replace(/\/api(?:\/.*)?$/, "").replace(/\/$/, "");
  }
};

const COCKPIT_ORIGIN = toOrigin(COCKPIT_API_URL);

const normalizeAssetPath = (value) => {
  if (!value) return "";
  const path = String(value).trim();
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;

  const cleanPath = path.replace(/^\/+/, "");
  if (cleanPath.startsWith("storage/")) return `/${cleanPath}`;
  if (cleanPath.startsWith("uploads/")) return `/storage/${cleanPath}`;

  return `/storage/uploads/${cleanPath}`;
};

const asAssetUrl = (path) => {
  if (!path) return "";
  const normalizedPath = normalizeAssetPath(path);
  if (/^https?:\/\//.test(normalizedPath)) return normalizedPath;
  if (!COCKPIT_ORIGIN) return normalizedPath;
  return `${COCKPIT_ORIGIN}${normalizedPath}`;
};


const asArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload && typeof payload === "object") {
    const keys = Object.keys(payload);
    if (keys.length > 0) {
      const arrays = keys.map((k) => payload[k]).filter(Array.isArray);
      if (arrays.length > 0) {
        return arrays.flat();
      }
    }
  }
  return [];
};

const asObject = (payload) => {
  if (!payload || Array.isArray(payload)) return {};
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
};

const asProPage = (payload) => {
  if (!payload || Array.isArray(payload)) {
    return null;
  }

  const direct = payload;
  const nestedData = payload.data && typeof payload.data === "object" && !Array.isArray(payload.data) ? payload.data : null;

  const candidates = [
    direct,
    direct?.page,
    direct?.item,
    direct?.entry,
    nestedData,
    nestedData?.page,
    nestedData?.item,
    nestedData?.entry,
  ].filter((candidate) => candidate && typeof candidate === "object" && !Array.isArray(candidate));

  const candidate = candidates.find(
    (candidate) =>
      Array.isArray(candidate.layout) ||
      Array.isArray(candidate.content) ||
      Array.isArray(candidate.body) ||
      typeof candidate.content === "string" ||
      typeof candidate.body === "string" ||
      typeof candidate.title === "string"
  ) || candidates[0] || null;

  // Flatten nested data if found in candidate.data
  let result = candidate;
  if (result && result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
    const { data } = result;
    // Merge data properties into result at top level
    result = {
      ...result,
      ...data,
    };
  }
  return result;
};

const addDefaultFilter = (preview, additionalFilter) => {
  if (preview) return additionalFilter || undefined;

  const publishedFilter = { _state: "published" };
  if (!additionalFilter) return publishedFilter;
  return { $and: [publishedFilter, additionalFilter] };
};

export const getSiteSettings = async ({ locale, preview = false } = {}) => {
  if (PRO_PAGES_ENABLED) {
    try {
      const response = await fetchPagesSettings({
        locale,
        preview,
        next: { tags: ["cockpit:settings"] },
      });
      const rawSettings = asObject(response);
      const logoPath = rawSettings.images?.logo?.path || rawSettings.logo?.path || "";
      const faviconPath = rawSettings.images?.favicon?.path || rawSettings.favicon?.path || "";
      return {
        ...rawSettings,
        logo_url: logoPath ? asAssetUrl(logoPath) : "",
        favicon_url: faviconPath ? asAssetUrl(faviconPath) : "",
        site_title: rawSettings.seo?.title || rawSettings.title || rawSettings.site_title || "BMDev.",
        site_description: rawSettings.seo?.description || rawSettings.description || rawSettings.site_description || "Content managed from Cockpit",
      };
    } catch (err) {
      console.error("Failed to fetch pages settings:", err);
    }
  }

  const response = await getSingleton(MODELS.siteSettings, {
    locale,
    preview,
    next: { tags: ["cockpit:settings"] },
  });

  const rawSettings = asObject(response);
  const logoPath = rawSettings.logo?.path || "";
  const faviconPath = rawSettings.favicon?.path || "";
  return {
    ...rawSettings,
    logo_url: logoPath ? asAssetUrl(logoPath) : "",
    favicon_url: faviconPath ? asAssetUrl(faviconPath) : "",
  };
};

export const getNavigation = async ({ locale, preview = false } = {}) => {
  if (PRO_PAGES_ENABLED) {
    try {
      const menu = await fetchMenu(PRO_PAGES_DEFAULT_MENU, {
        locale,
        preview,
        next: { tags: ["cockpit:menus", "cockpit:pages"] },
      });

      // Pro Pages menu structure has links array
      return asArray(menu?.links || menu?.items || menu);
    } catch {
      return [];
    }
  }

  try {
    const tree = await getTree(MODELS.menus, {
      locale,
      preview,
      next: { tags: ["cockpit:menus"] },
    });

    return asArray(tree);
  } catch {
    return [];
  }
};

export const getMenuByName = async (name, { locale, preview = false } = {}) => {
  if (PRO_PAGES_ENABLED) {
    try {
      const menu = await fetchMenu(name, {
        locale,
        preview,
        next: { tags: ["cockpit:menus", "cockpit:pages"] },
      });

      return asArray(menu?.links || menu?.items || menu);
    } catch {
      return [];
    }
  }

  try {
    const tree = await getTree(name, {
      locale,
      preview,
      next: { tags: ["cockpit:menus"] },
    });

    return asArray(tree);
  } catch {
    return [];
  }
};


export const getLatestPosts = async ({ locale, limit = 9, preview = false } = {}) => {
  const response = await getItems(MODELS.posts, {
    locale,
    limit,
    populate: 1,
    sort: { _created: -1 },
    filter: addDefaultFilter(preview),
    preview,
    next: { tags: ["cockpit:posts"] },
  });

  return asArray(response);
};

export const getAllPostSlugs = async ({ locale, preview = false } = {}) => {
  const response = await getItems(MODELS.posts, {
    locale,
    fields: { slug: 1 },
    limit: 200,
    filter: addDefaultFilter(preview),
    preview,
    next: { tags: ["cockpit:posts"] },
  });

  return asArray(response).map((item) => item.slug).filter(Boolean);
};

export const getPostBySlug = async ({ slug, locale, preview = false } = {}) => {
  if (!slug) return null;

  const response = await getItems(MODELS.posts, {
    locale,
    limit: 1,
    populate: 1,
    filter: addDefaultFilter(preview, { slug }),
    preview,
    next: { tags: ["cockpit:posts"] },
  });

  return asArray(response)[0] || null;
};

export const getPageBySlug = async ({ slug, locale, preview = false, page: pageQuery } = {}) => {
  const normalizedSlug = !slug || slug === "/" ? "home" : slug.replace(/^\/+|\/+$/g, "");

  if (PRO_PAGES_ENABLED) {
    const route = normalizedSlug === "home" ? "/" : `/${normalizedSlug}`;

    let response = await fetchPageByRoute({
      route,
      locale,
      preview,
      next: { tags: ["cockpit:pages"] },
    }).catch(() => null);

    if (response && response.type === "collection" && pageQuery) {
      const currentPage = parseInt(pageQuery, 10);
      if (!isNaN(currentPage) && currentPage > 1) {
        const limit = response.data?.limit || response._pagination?.limit || 4;
        const skip = (currentPage - 1) * limit;

        const paginatedResponse = await fetchPageByRoute({
          route,
          locale,
          preview,
          next: { tags: ["cockpit:pages"] },
          skip,
        }).catch(() => null);

        if (paginatedResponse) {
          response = paginatedResponse;
        }
      }
    }

    return asProPage(response);
  }

  const response = await getItems(MODELS.pages, {
    locale,
    limit: 1,
    populate: 1,
    filter: addDefaultFilter(preview, { slug: normalizedSlug }),
    preview,
    next: { tags: ["cockpit:pages"] },
  });

  return asArray(response)[0] || null;
};

export const getAllPageSlugs = async ({ locale, preview = false } = {}) => {
  if (PRO_PAGES_ENABLED) {
    const routes = await fetchRoutes({
      locale,
      preview,
      next: { tags: ["cockpit:pages"] },
    }).catch(() => []);

    return asArray(routes)
      .map((entry) => entry.slug || entry.route || entry.path)
      .filter(Boolean)
      .map((value) => {
        const normalized = String(value).replace(/^\/+|\/+$/g, "");
        if (!normalized) return "home";

        if (locale && normalized.startsWith(`${locale}/`)) {
          return normalized.slice(locale.length + 1) || "home";
        }

        return normalized;
      });
  }

  const response = await getItems(MODELS.pages, {
    locale,
    limit: 300,
    fields: { slug: 1 },
    filter: addDefaultFilter(preview),
    preview,
    next: { tags: ["cockpit:pages"] },
  });

  return asArray(response).map((page) => page.slug).filter(Boolean);
};
