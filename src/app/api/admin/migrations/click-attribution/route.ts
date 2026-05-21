import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

const migration = `
alter table outbound_clicks add column if not exists placement text not null default 'unknown';
alter table outbound_clicks add column if not exists campaign text;

create index if not exists outbound_clicks_placement_created_idx on outbound_clicks(placement, created_at desc);
`;

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await getPool().query(migration);
  return NextResponse.json({ ok: true, migration: "click-attribution" });
}
