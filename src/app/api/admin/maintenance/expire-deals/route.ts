import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { expirePastDeals } from "@/lib/deals";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const result = await expirePastDeals();
  const acceptsJson = request.headers.get("accept")?.includes("application/json");

  if (!acceptsJson) {
    return NextResponse.redirect(getSiteUrl(`/admin?expired=${result.expired}`), 303);
  }

  return NextResponse.json({ ok: true, ...result });
}
