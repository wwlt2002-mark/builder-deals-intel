import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

const migration = `
create table if not exists outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references deals(id) on delete set null,
  slug text not null,
  destination_url text not null,
  is_affiliate boolean not null default false,
  affiliate_network text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists outbound_clicks_deal_created_idx on outbound_clicks(deal_id, created_at desc);
create index if not exists outbound_clicks_created_idx on outbound_clicks(created_at desc);
`;

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await getPool().query(migration);
  return NextResponse.json({ ok: true, migration: "outbound-clicks" });
}
