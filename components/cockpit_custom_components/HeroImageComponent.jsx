import { COCKPIT_API_URL } from "@/config/cockpit";
import { getAssetImageUrl } from "@/lib/cockpit";
import { LuZap } from "react-icons/lu";

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

export default function HeroImageComponent({ data }) {
  const image = data?.image || data?.asset || data?.src || data?.media || null;
  const imageAlt = data?.caption || image?.title || data?.alt || "";
  const currentTech = typeof data?.currentengine === "string" && data.currentengine.trim()
    ? data.currentengine.trim()
    : "Next.js + Cockpit CMS";
  const imageSrc = image?.path ? asAssetUrl(image.path) : "";
  const backgroundSrc = imageSrc || (image?._id ? getAssetImageUrl(image) : "");

  if (!backgroundSrc) {
    return null;
  }

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-xl border border-[#27272A] bg-[#121212] p-1.5 shadow-2xl h-80 lg:h-[450px] flex flex-col justify-end"
        role="img"
        aria-label={imageAlt || "preview"}
      >
        {backgroundSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundSrc}
            alt={imageAlt || "Developer portrait"}
            className="w-full h-full object-cover rounded-lg opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : null}

        <div className="absolute z-30 bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg bg-[#121212]/90 border border-[#27272A] p-3 backdrop-blur-xl">
          <div>
            <p className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#E8452C]">
              CURRENT TECH
            </p>
            <p className="text-xs font-semibold text-[#FAFAFA]">{currentTech}</p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#181818] border border-[#27272A] text-[#E8452C]">
            <span aria-hidden="true">
              <LuZap className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
