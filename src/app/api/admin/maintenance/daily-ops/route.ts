import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { expirePastDeals } from "@/lib/deals";
import { ingestMonitoredSources } from "@/lib/source-ingest";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const expired = await expirePastDeals();
  const ingested = await ingestMonitoredSources();
  const result = {
    expired: expired.expired,
    sources: ingested.sources,
    candidates: ingested.candidates,
    upserted: ingested.upserted
  };
  const acceptsJson = request.headers.get("accept")?.includes("application/json");

  if (!acceptsJson) {
    return NextResponse.redirect(new URL(`/admin?daily=${result.candidates}`, request.url), 303);
  }

  return NextResponse.json({ ok: true, ...result });
}
