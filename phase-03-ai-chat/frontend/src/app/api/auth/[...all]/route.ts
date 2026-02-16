import { NextResponse } from "next/server";

// Better Auth API route — will be implemented in Phase 3 (US1)
export async function GET() {
  return NextResponse.json({ error: "Auth not configured" }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: "Auth not configured" }, { status: 501 });
}
