import Link from "next/link";
import { cn } from "@/lib/utils";
import { COCKPIT_MULTI_LANGUAGE_ENABLED } from "@/config/cockpit";

const toLocalHref = (url, locale) => {
  if (!url) return "#";
  if (!url.startsWith("/") || !locale || !COCKPIT_MULTI_LANGUAGE_ENABLED) return url;
  return `/${locale}${url === "/" ? "" : url}`;
};

const getContrastColor = (hexColor) => {
  if (!hexColor) return "#000000";
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6 && hex.length !== 3) return "#000000";

  let r, g, b;
  if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    r = parseInt(hex.substring(0, 1) + hex.substring(0, 1), 16);
    g = parseInt(hex.substring(1, 2) + hex.substring(1, 2), 16);
    b = parseInt(hex.substring(2, 3) + hex.substring(2, 3), 16);
  }

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
};

export default function CustomButtonComponent({ data, locale, className }) {
  const url = data?.url || "";
  const caption = data?.caption || "";
  const target = data?.target || "_self";
  const modelColors = data?.colors?.modelColors || "solid";
  const type_1 = data?.colors?.type_1 || "#000000";
  const type_2 = data?.colors?.type_2 || null;

  const href = toLocalHref(url, locale);

  let style = {};
  if (modelColors === "gradients" && type_1 && type_2) {
    style.background = `linear-gradient(135deg, ${type_1}, ${type_2})`;
    style.color = getContrastColor(type_1);
  } else {
    style.backgroundColor = type_1;
    style.color = getContrastColor(type_1);
  }

  const isWhiteBackground = type_1.toLowerCase() === "#ffffff" || type_1.toLowerCase() === "#fff";

  return (
    <Link
      href={href}
      target={target}
      style={style}
      className={cn(
        "inline-flex items-center justify-center font-bold px-7 py-4 rounded-[22px] hover:rounded-[10px] text-sm shadow-md transition-all duration-350 ease-[cubic-bezier(.34,1.56,.64,1)] text-center hover:scale-[1.04] active:scale-[0.97] mr-4 w-fit",
        isWhiteBackground && "border border-[#1E3A2C] mr-4 w-fit",
        className
      )}
    >
      {caption}
    </Link>
  );
}
