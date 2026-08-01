import { NextResponse } from "next/server";
import { COCKPIT_API_URL, COCKPIT_API_KEY } from "@/config/cockpit";

export async function POST(request, context) {
  const { token } = await context.params;

  if (!COCKPIT_API_URL) {
    return NextResponse.json({ error: "Missing COCKPIT_API_URL configuration" }, { status: 500 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const fetchOptions = {
      method: "POST",
      headers: {
        "api-key": COCKPIT_API_KEY,
      },
    };

    if (contentType.includes("application/json")) {
      const json = await request.json();
      fetchOptions.body = JSON.stringify(json);
      fetchOptions.headers["Content-Type"] = "application/json";
    } else {
      // Re-route the multipart/form-data or urlencoded fields
      const formData = await request.formData();
      fetchOptions.body = formData;
      // Do not manually set Content-Type for FormData, browser/fetch handles the boundary.
    }

    const targetUrl = `${COCKPIT_API_URL}/inbox/submit/${token}`;
    const response = await fetch(targetUrl, fetchOptions);

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Inbox submit proxy error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit form to inbox" }, { status: 500 });
  }
}
