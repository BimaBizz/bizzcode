import { cockpitRequest } from "@/lib/cockpit";

export async function advancedSearch({ index, q, limit, offset, filter, locale, preview = false, next } = {}) {
  if (!index) {
    throw new Error("Detektivo index is required");
  }

  if (!q || typeof q !== "string") {
    throw new Error("Search query (q) is required");
  }

  return cockpitRequest(`/detektivo/search/${encodeURIComponent(index)}`, {
    query: {
      q,
      limit,
      offset,
      filter,
      locale,
    },
    preview,
    next,
  });
}
