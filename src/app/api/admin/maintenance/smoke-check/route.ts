import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { runPublicSmokeCheck } from "@/lib/public-smoke";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await runPublicSmokeCheck();
  const acceptsJson = request.headers.get("accept")?.includes("application/json");

  if (!acceptsJson) {
    return NextResponse.redirect(getSiteUrl(`/admin?smoke=${result.ok ? "passed" : "failed"}`), 303);
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
