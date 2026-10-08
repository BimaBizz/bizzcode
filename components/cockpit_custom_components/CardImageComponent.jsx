import { COCKPIT_API_URL } from "@/config/cockpit";

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

export default function CardImageComponent({ data }) {
  if (!data) return null;

  const image = data.image || null;
  const title = typeof data.title === "string" ? data.title : "";
  const subTitle = typeof data.subTitle === "string" ? data.subTitle : "";
  const imageAlt = image?.title || image?.altText || title || "Card background image";

  const imageUrl = image?.path ? asAssetUrl(image.path) : "";

  return (
    <article className="relative w-full h-full rounded-xl border border-[#27272A] overflow-hidden shadow-xl transition-all duration-300 hover:border-[#3F3F46] group min-h-[300px] md:min-h-[340px] flex flex-col justify-end bg-[#121212]">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-80"
        />
      )}

      {/* Subtle overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/40 to-transparent pointer-events-none z-10" />

      {/* Content overlay */}
      <div className="relative z-20 p-6 select-none">
        {title && (
          <span className="text-xs font-mono font-medium text-[#A1A1AA] tracking-wider uppercase mb-1 block">
            {title}
          </span>
        )}
        {subTitle && (
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#FAFAFA] leading-tight">
            {subTitle}
          </h3>
        )}
      </div>
    </article>
  );
}
