import { NextRequest, NextResponse } from "next/server";
import { createProject, getProjects } from "@/lib/projects";

function authorized(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password && request.headers.get("x-admin-password") === password);
}

export async function GET() {
  try {
    return NextResponse.json(await getProjects());
  } catch {
    return NextResponse.json({ error: "Could not load projects." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });
  }

  try {
    return NextResponse.json(await createProject(await request.json()), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create project.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
