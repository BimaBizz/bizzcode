import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { PREVIEW_SECRET } from "@/config/cockpit";

function safeSlug(slug) {
  if (!slug || typeof slug !== "string") return "/";
  if (!slug.startsWith("/")) return "/";
  if (slug.startsWith("//")) return "/";
  return slug;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = safeSlug(searchParams.get("slug") || "/");

  if (!PREVIEW_SECRET || secret !== PREVIEW_SECRET) {
    return Response.json({ ok: false, message: "Invalid preview secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(slug, request.url));
}
