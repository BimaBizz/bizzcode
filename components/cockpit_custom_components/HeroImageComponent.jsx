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
    : "Liquid Glass Engine v2.0";
  const imageSrc = image?.path ? asAssetUrl(image.path) : "";
  const backgroundSrc = imageSrc || (image?._id ? getAssetImageUrl(image) : "");

  if (!backgroundSrc) {
    return null;
  }

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-tr-[28px] rounded-bl-[28px] rounded-tl-[8px] rounded-br-[8px] border border-[#1E3A2C] bg-[#152B21] p-2 shadow-2xl transition-all duration-400 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:rounded-tr-[8px] group-hover:rounded-bl-[8px] group-hover:rounded-tl-[28px] group-hover:rounded-br-[28px] h-80 lg:h-[450px] flex flex-col justify-end"
        role="img"
        aria-label={imageAlt || "preview"}
      >
        {backgroundSrc ? (
          <img
            src={backgroundSrc}
            alt={imageAlt || "Developer portrait"}
            className="w-full h-full object-cover rounded-tr-[20px] rounded-bl-[20px] rounded-tl-[4px] rounded-br-[4px] opacity-90 transition-all duration-400 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:rounded-tr-[4px] group-hover:rounded-bl-[4px] group-hover:rounded-tl-[20px] group-hover:rounded-br-[20px]"
          />
        ) : null}

        <div className="absolute z-30 bottom-4 left-4 right-4 flex items-center justify-between rounded-[16px] bg-[#0F221A]/85 border border-[#1E3A2C] p-3.5 backdrop-blur-xl">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#4ADE80]">CURRENT TECH USED</p>
            <p className="text-xs font-semibold text-[#EAF6EF]">{currentTech}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F3D24] text-[#4ADE80]">
            <span aria-hidden="true">
              <LuZap className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
