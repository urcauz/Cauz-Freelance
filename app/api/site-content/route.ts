import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/site-content";

const authorized = (request: NextRequest) => Boolean(process.env.ADMIN_PASSWORD && request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD);

export async function GET() {
  try { return NextResponse.json(await getSiteContent()); } catch { return NextResponse.json({ error: "Could not load site content." }, { status: 500 }); }
}

export async function PUT(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });
  try { return NextResponse.json(await updateSiteContent(await request.json())); } catch { return NextResponse.json({ error: "Could not save site content." }, { status: 400 }); }
}
