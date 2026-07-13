import { NextResponse } from "next/server";

const DEFAULT_INTENT_URL = "https://api.crmai.greybrain.ai/api/website/intent";
const DEFAULT_WEBSITE_ORIGIN = "https://www.santaan.in";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const url = process.env.WEBSITE_INTENT_API_URL?.trim() || DEFAULT_INTENT_URL;
  const token = process.env.WEBSITE_INTENT_API_TOKEN?.trim();
  const websiteOrigin =
    process.env.WEBSITE_INTENT_ORIGIN?.trim() || DEFAULT_WEBSITE_ORIGIN;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Origin: websiteOrigin,
  };

  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    headers["User-Agent"] = userAgent;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Intent proxy error:", error);
    return NextResponse.json({ error: "Intent forwarding failed" }, { status: 502 });
  }
}
