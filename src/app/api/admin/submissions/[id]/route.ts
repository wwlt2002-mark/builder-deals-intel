import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { getSiteUrl } from "@/lib/site-url";
import { updateSubmissionStatus } from "@/lib/storage";

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

  if (!["queued", "reviewed", "spam"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await updateSubmissionStatus(id, status);
  return NextResponse.redirect(getSiteUrl("/admin"), 303);
}
