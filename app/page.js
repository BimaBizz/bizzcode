import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/config/cockpit";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function Home() {
  redirect(`/${DEFAULT_LOCALE}`);
}