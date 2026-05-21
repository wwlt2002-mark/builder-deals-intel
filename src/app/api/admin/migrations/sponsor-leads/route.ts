import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

const migration = `
create table if not exists sponsor_leads (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text,
  email text not null,
  website text,
  offer_type text not null,
  budget text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists sponsor_leads_status_created_idx on sponsor_leads(status, created_at desc);
`;

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await getPool().query(migration);
  return NextResponse.json({ ok: true, migration: "sponsor-leads" });
}
