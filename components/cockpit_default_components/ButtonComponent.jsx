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
      className="inline-flex items-center rounded-full bg-foreground px-6 py-4 mr-4 text-sm font-medium text-card"
    >
      {data.caption || "Open"}
    </Link>
  );
}
