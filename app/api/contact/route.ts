import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/leads";

export async function POST(request: NextRequest) {
  try { return NextResponse.json(await createLead(await request.json()), { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not send message." }, { status: 400 }); }
}
