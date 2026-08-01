const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const normalizeAudience = (audience) => {
  if (!audience) return [];
  if (Array.isArray(audience)) return audience.map((entry) => String(entry).trim()).filter(Boolean);
  return String(audience)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const getNestedValue = (input, path) => {
  const segments = path.split(".");
  let current = input;

  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;
    current = current[segment];
    if (current === undefined) return undefined;
  }

  return current;
};

const replaceVariables = (value, variables = {}) => {
  if (typeof value !== "string") return value;

  return value.replace(/\{\{\s*([^}:]+?)\s*(?::\s*([^}]*))?\s*\}\}/g, (_match, keyPath, fallback) => {
    const replacement = getNestedValue(variables, keyPath.trim());
    if (replacement === undefined || replacement === null || replacement === "") {
      return fallback !== undefined ? fallback : "";
    }
    return String(replacement);
  });
};

const jaccardScore = (left, right) => {
  const leftSet = new Set(left);
  const rightSet = new Set(right);

  if (!leftSet.size && !rightSet.size) return 1;

  const intersection = [...leftSet].filter((item) => rightSet.has(item)).length;
  const union = new Set([...leftSet, ...rightSet]).size;
  return union ? intersection / union : 0;
};

const resolveBestVariant = (variants, audience = []) => {
  const activeVariants = variants.filter((variant) => variant && variant.active !== false);
  if (!activeVariants.length) return null;

  let best = activeVariants[0];
  let bestScore = jaccardScore(normalizeAudience(best.audience), audience);

  for (const variant of activeVariants.slice(1)) {
    const score = jaccardScore(normalizeAudience(variant.audience), audience);
    if (score > bestScore) {
      best = variant;
      bestScore = score;
    }
  }

  return best;
};

const resolveNode = (node, context) => {
  const { audience, variables } = context;

  if (Array.isArray(node)) {
    return node.map((entry) => resolveNode(entry, context));
  }

  if (!isObject(node)) {
    return replaceVariables(node, variables);
  }

  if (Array.isArray(node["personi:variants"]) && audience.length) {
    const winner = resolveBestVariant(node["personi:variants"], audience);
    if (winner && winner.data !== undefined) {
      return resolveNode(winner.data, context);
    }
  }

  return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, resolveNode(value, context)]));
};

export const personiToQuery = (audienceContext = {}) => {
  const audience = normalizeAudience(audienceContext.audience);

  return {
    personi: audience.length ? audience.join(",") : undefined,
    tz_offset: audienceContext.tzOffset,
    personi_vars: audienceContext.variables,
  };
};

export async function resolveVariant(content, audienceContext = {}) {
  const audience = normalizeAudience(audienceContext.audience);
  if (!audience.length) return content;

  return resolveNode(content, {
    audience,
    variables: audienceContext.variables || {},
  });
}
