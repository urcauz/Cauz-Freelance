import { NextResponse } from "next/server";
import { appendAnalyticsEvent } from "lib/dashboardStore";

function sanitize(input, maxLength = 240) {
  return String(input || "").trim().slice(0, maxLength);
}

function sanitizeProperties(input) {
  if (!input || typeof input !== "object") return {};

  const entries = Object.entries(input).slice(0, 24);
  const sanitized = {};

  for (const [key, value] of entries) {
    const safeKey = sanitize(key, 48);
    if (!safeKey) continue;

    if (typeof value === "number" || typeof value === "boolean") {
      sanitized[safeKey] = value;
      continue;
    }

    sanitized[safeKey] = sanitize(value, 200);
  }

  return sanitized;
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const name = sanitize(payload.name, 120);

    if (!name) {
      return NextResponse.json({ ok: false, error: "Event name is required." }, { status: 400 });
    }

    const event = {
      id: `evt_${Date.now()}`,
      name,
      path: sanitize(payload.path, 180),
      properties: sanitizeProperties(payload.properties),
      createdAt: new Date().toISOString(),
      userAgent: sanitize(request.headers.get("user-agent"), 300),
      ip:
        sanitize(request.headers.get("x-forwarded-for")?.split(",")[0], 80) ||
        sanitize(request.headers.get("x-real-ip"), 80)
    };

    await appendAnalyticsEvent(event);

    return NextResponse.json({ ok: true, eventId: event.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to store analytics event.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
