import { NextRequest, NextResponse } from "next/server";
import { createTestimonial, getTestimonials } from "@/lib/testimonials";

const authorized = (request: NextRequest) => Boolean(process.env.ADMIN_PASSWORD && request.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD);

export async function GET() { try { return NextResponse.json(await getTestimonials()); } catch { return NextResponse.json({ error: "Could not load testimonials." }, { status: 500 }); } }
export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });
  try { return NextResponse.json(await createTestimonial(await request.json()), { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not add testimonial." }, { status: 400 }); }
}
