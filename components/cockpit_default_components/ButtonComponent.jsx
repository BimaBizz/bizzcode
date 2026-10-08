import Link from "next/link";
import { COCKPIT_MULTI_LANGUAGE_ENABLED } from "@/config/cockpit";

const toLocalHref = (url, locale) => {
  if (!url) return "#";
  if (!url.startsWith("/") || !locale || !COCKPIT_MULTI_LANGUAGE_ENABLED) return url;
  return `/${locale}${url === "/" ? "" : url}`;
};

export default function ButtonComponent({ data, locale }) {
  const href = toLocalHref(data.url, locale);
  return (
    <Link
      href={href}
      target={data.target || "_self"}
      className="inline-flex items-center justify-center font-medium px-5 py-2.5 rounded-lg text-xs bg-[#E8452C] hover:bg-[#d43c24] text-white shadow-sm transition-colors mr-3"
    >
      {data.caption || "Open"}
    </Link>
  );
}
