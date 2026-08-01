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
    <article className="relative w-full h-full rounded-[28px] border border-[#1E3A2C] overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 group min-h-[320px] md:min-h-[360px] flex flex-col justify-end bg-[#081410]">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
        />
      )}

      {/* Subtle overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04100A]/95 via-[#04100A]/40 to-transparent pointer-events-none z-10" />

      {/* Content overlay */}
      <div className="relative z-20 p-8 select-none">
        {title && (
          <span className="text-xs font-bold text-[#8FAB9C] font-mono tracking-widest uppercase mb-1.5 block">
            {title}
          </span>
        )}
        {subTitle && (
          <h3 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-[#EAF6EF] leading-tight">
            {subTitle}
          </h3>
        )}
      </div>
    </article>
  );
}
