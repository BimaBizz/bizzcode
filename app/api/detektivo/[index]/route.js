import { PRO_DETEKTIVO_ENABLED } from "@/config/cockpit";
import { advancedSearch } from "@/lib/pro/detektivo";

const toInt = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export async function GET(request, context) {
  if (!PRO_DETEKTIVO_ENABLED) {
    return Response.json({ ok: false, message: "Detektivo integration is disabled" }, { status: 404 });
  }

  const { index } = await context.params;
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q) {
    return Response.json({ ok: false, message: "Missing search query: q" }, { status: 400 });
  }

  try {
    const payload = await advancedSearch({
      index,
      q,
      limit: toInt(searchParams.get("limit")),
      offset: toInt(searchParams.get("offset")),
      filter: searchParams.get("filter") || undefined,
      locale: searchParams.get("locale") || undefined,
    });

    return Response.json(payload);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Detektivo request failed",
      },
      { status: 500 }
    );
  }
}
