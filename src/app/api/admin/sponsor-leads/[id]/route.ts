import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { updateSponsorLeadStatus } from "@/lib/storage";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const form = await request.formData();
  const status = String(form.get("status") ?? "").trim();

  if (!["new", "contacted", "qualified", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await updateSponsorLeadStatus(id, status);
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
