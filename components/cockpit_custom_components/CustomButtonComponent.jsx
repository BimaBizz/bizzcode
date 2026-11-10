import Link from "next/link";
import { cn } from "@/lib/utils";
import { COCKPIT_MULTI_LANGUAGE_ENABLED } from "@/config/cockpit";

const toLocalHref = (url, locale) => {
  if (!url) return "#";
  if (!url.startsWith("/") || !locale || !COCKPIT_MULTI_LANGUAGE_ENABLED) return url;
  return `/${locale}${url === "/" ? "" : url}`;
};

const getContrastColor = (hexColor) => {
  if (!hexColor) return "#FFFFFF";
  const hex = hexColor.replace("#", "").trim();
  if (hex.length !== 6 && hex.length !== 3 && hex.length !== 8) return "#FFFFFF";

  let r, g, b;
  if (hex.length === 6 || hex.length === 8) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
    g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
    b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
  }

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#111111" : "#FFFFFF";
};

const normalizeBrandHex = (hex) => {
  if (!hex || typeof hex !== "string") return "#D9541E";
  const lower = hex.trim().toLowerCase();
  if (lower === "#e8452c" || lower === "#ff5200" || lower === "#d43c24") return "#D9541E";
  if (lower === "#0a0a0a" || lower === "#121212" || lower === "#181818" || lower === "#000000" || lower === "#000") return "#111111";
  return hex;
};

export default function CustomButtonComponent({ data, locale, className }) {
  const url = data?.url || "";
  const caption = data?.caption || "";
  const target = data?.target || "_self";
  const modelColors = data?.colors?.modelColors || "solid";
  const type_1 = normalizeBrandHex(data?.colors?.type_1 || "#D9541E");
  const type_2 = data?.colors?.type_2 ? normalizeBrandHex(data.colors.type_2) : null;

  const href = toLocalHref(url, locale);

  let style = {};
  if (modelColors === "gradients" && type_1 && type_2) {
    style.background = `linear-gradient(135deg, ${type_1}, ${type_2})`;
    style.color = getContrastColor(type_1);
  } else {
    style.backgroundColor = type_1;
    style.color = getContrastColor(type_1);
  }

  const isLightBackground =
    type_1.toLowerCase() === "#ffffff" ||
    type_1.toLowerCase() === "#fff" ||
    type_1.toLowerCase() === "#f3eee3" ||
    type_1.toLowerCase() === "#faf7f0";

  return (
    <Link
      href={href}
      target={target}
      style={style}
      className={cn(
        "inline-flex items-center justify-center font-medium px-5 py-2.5 rounded-lg text-xs shadow-sm transition-all duration-200 text-center hover:opacity-90 active:scale-95 mr-3 w-fit",
        isLightBackground && "border border-[#111111]/20",
        className
      )}
    >
      {caption}
    </Link>
  );
}
