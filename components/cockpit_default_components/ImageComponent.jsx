import CockpitImage from "@/components/cockpit-image";
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

export default function ImageComponent({ item, data }) {
  const image = data?.image || data?.asset || data?.src || data?.media || null;
  const imageAlt = data?.caption || image?.title || data?.alt || "";

  const meta = item?.meta || data?.meta || {};
  const width = meta.w || meta.width;
  const height = meta.h || meta.height;

  const style = {
    maxWidth: "100%",
  };
  let imgClass = "rounded-xl";

  if (width && height) {
    style.width = typeof width === "number" ? `${width}px` : width;
    style.height = typeof height === "number" ? `${height}px` : height;
    imgClass += " object-cover";
  } else {
    if (width) {
      style.width = typeof width === "number" ? `${width}px` : width;
      style.height = "auto";
    } else if (height) {
      style.height = typeof height === "number" ? `${height}px` : height;
      style.width = "auto";
    } else {
      style.width = "100%";
      style.height = "auto";
    }
  }

  return (
    <figure className="space-y-2">
      {image?.path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asAssetUrl(image.path)}
          alt={imageAlt}
          className={imgClass}
          style={style}
        />
      ) : image?._id ? (
        <CockpitImage
          asset={image}
          alt={imageAlt}
          className={imgClass}
          style={style}
        />
      ) : null}
      {data.caption ? <figcaption className="text-sm opacity-70">{data.caption}</figcaption> : null}
    </figure>
  );
}
