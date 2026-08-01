import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/config/cockpit";

export default function Home() {
  redirect(`/${DEFAULT_LOCALE}`);
}