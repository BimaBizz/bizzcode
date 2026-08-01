import {
  COCKPIT_API_KEY,
  COCKPIT_API_URL,
  COCKPIT_DEFAULT_API_LOCALE,
  COCKPIT_LOCALE_MAP,
  COCKPIT_MULTI_LANGUAGE_ENABLED,
  COCKPIT_PREVIEW_API_KEY,
} from "@/config/cockpit";

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const asQueryValue = (value) => {
  if (value === undefined || value === null || value === "") return null;
  if (isObject(value) || Array.isArray(value)) return JSON.stringify(value);
  return String(value);
};

const resolveApiLocale = (locale) => {
  if (!COCKPIT_MULTI_LANGUAGE_ENABLED) {
    return COCKPIT_DEFAULT_API_LOCALE || "default";
  }

  if (!locale) {
    return COCKPIT_DEFAULT_API_LOCALE || null;
  }

  return COCKPIT_LOCALE_MAP[locale] || locale;
};

const toSearchParams = (query = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    const normalizedValue = key === "locale" ? resolveApiLocale(value) : value;
    const queryValue = asQueryValue(normalizedValue);
    if (queryValue !== null) params.set(key, queryValue);
  });

  return params;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return { message: text };
};

const assertConfig = (preview = false) => {
  if (!COCKPIT_API_URL) {
    throw new Error("Missing COCKPIT_API_URL environment variable");
  }

  const key = preview ? COCKPIT_PREVIEW_API_KEY : COCKPIT_API_KEY;
  if (!key) {
    throw new Error(
      preview
        ? "Missing COCKPIT_PREVIEW_API_KEY (or COCKPIT_API_KEY) environment variable"
        : "Missing COCKPIT_API_KEY environment variable"
    );
  }

  return key;
};

export const cockpitRequest = async (path, { query, preview = false, next, method = "GET", body, cache } = {}) => {
  const apiKey = assertConfig(preview);
  const params = toSearchParams(query);
  const queryString = params.toString();
  const url = `${COCKPIT_API_URL}${path}${queryString ? `?${queryString}` : ""}`;

  const fetchCache = preview ? "no-store" : cache;

  const response = await fetch(url, {
    method,
    ...(fetchCache ? { cache: fetchCache } : {}),
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
    next,
  });

  if (!response.ok) {
    const payload = await parseResponse(response);
    throw new Error(
      `Cockpit request failed (${response.status} ${response.statusText}) for ${path}: ${JSON.stringify(payload)}`
    );
  }

  return parseResponse(response);
};

export const getItems = (model, options = {}) =>
  cockpitRequest(`/content/items/${model}`, {
    query: {
      locale: options.locale,
      filter: options.filter,
      sort: options.sort,
      fields: options.fields,
      limit: options.limit,
      skip: options.skip,
      populate: options.populate,
    },
    preview: options.preview,
    next: options.next,
  });

export const getItem = (model, id, options = {}) =>
  cockpitRequest(`/content/item/${model}/${id}`, {
    query: {
      locale: options.locale,
      fields: options.fields,
      populate: options.populate,
    },
    preview: options.preview,
    next: options.next,
  });

export const getSingleton = (model, options = {}) =>
  cockpitRequest(`/content/item/${model}`, {
    query: {
      locale: options.locale,
      filter: options.filter,
      fields: options.fields,
      populate: options.populate,
    },
    preview: options.preview,
    next: options.next,
  });

export const getTree = (model, options = {}) =>
  cockpitRequest(`/content/tree/${model}`, {
    query: {
      locale: options.locale,
      fields: options.fields,
      populate: options.populate,
    },
    preview: options.preview,
    next: options.next,
  });

export const getAsset = (id, options = {}) =>
  cockpitRequest(`/assets/${id}`, {
    preview: options.preview,
    next: options.next,
  });

export const getAssetImageUrl = (assetOrId, options = {}) => {
  const getOrigin = (apiUrl) => {
    if (!apiUrl) return "";
    try {
      return new URL(apiUrl).origin;
    } catch {
      return apiUrl.replace(/\/api(?:\/.*)?$/, "").replace(/\/$/, "");
    }
  };

  const hasResizeOptions = !!(options.width || options.height || options.mode || options.mime);

  if (assetOrId && typeof assetOrId === "object") {
    const asset = assetOrId;
    const assetPath = asset.path || "";

    if (assetPath && !hasResizeOptions) {
      const cleanPath = assetPath.replace(/^\/+/, "");
      const storagePath = cleanPath.startsWith("storage/")
        ? `/${cleanPath}`
        : `/storage/uploads/${cleanPath}`;
      return `${getOrigin(COCKPIT_API_URL)}${storagePath}`;
    }

    const id = asset._id;
    if (!id) return "";

    const params = toSearchParams({
      m: options.mode,
      w: options.width,
      h: options.height,
      q: options.quality,
      mime: options.mime,
      t: options.cacheBuster,
      o: 1,
    });
    const queryString = params.toString();
    return `${COCKPIT_API_URL}/assets/image/${id}${queryString ? `?${queryString}` : ""}`;
  }

  const id = assetOrId;
  const params = toSearchParams({
    m: options.mode,
    w: options.width,
    h: options.height,
    q: options.quality,
    mime: options.mime,
    t: options.cacheBuster,
    o: 1,
  });
  const queryString = params.toString();
  return `${COCKPIT_API_URL}/assets/image/${id}${queryString ? `?${queryString}` : ""}`;
};

export const batchItems = (models, options = {}) =>
  cockpitRequest("/content/items", {
    query: {
      models,
      locale: options.locale,
    },
    preview: options.preview,
    next: options.next,
  });
