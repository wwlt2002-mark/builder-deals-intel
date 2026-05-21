import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

const migration = `
alter table deals add column if not exists affiliate_network text;
alter table deals add column if not exists affiliate_program text;
alter table deals add column if not exists affiliate_status text not null default 'none';
alter table deals add column if not exists affiliate_notes text;

update deals
set affiliate_status = case when is_affiliate then 'active' else 'none' end
where affiliate_status = 'none';
`;

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await getPool().query(migration);
  return NextResponse.json({ ok: true, migration: "affiliate-tracking" });
}
