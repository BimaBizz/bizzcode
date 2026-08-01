import Link from "next/link";
import { COCKPIT_MULTI_LANGUAGE_ENABLED } from "@/config/cockpit";

const toLocalHref = (url, locale) => {
  if (!url) return "#";
  if (!url.startsWith("/") || !locale || !COCKPIT_MULTI_LANGUAGE_ENABLED) return url;
  return `/${locale}${url === "/" ? "" : url}`;
};

export default function LinkComponent({ data, locale }) {
  const href = toLocalHref(data.url, locale);
  return (
    <Link href={href} target={data.target || "_self"} className="underline underline-offset-4">
      {data.caption || href}
    </Link>
  );
}
