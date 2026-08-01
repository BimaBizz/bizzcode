import { COCKPIT_API_URL, COCKPIT_API_KEY } from "@/config/cockpit";

export async function POST(req) {
  try {
    const { messages, uid, useTools } = await req.json();

    const response = await fetch(`${COCKPIT_API_URL}/autopilot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": COCKPIT_API_KEY,
      },
      body: JSON.stringify({ messages, uid, useTools }),
    });

    if (!response.ok) {
      return new Response("Failed to fetch from Cockpit", { status: response.status });
    }

    // Proxy the stream back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in Next.js chat proxy route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
