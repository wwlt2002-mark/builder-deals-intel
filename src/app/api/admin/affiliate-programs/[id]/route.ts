import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { updateAffiliateProgramStatus, type AffiliatePipelineStatus } from "@/lib/affiliate-programs";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

const statuses: AffiliatePipelineStatus[] = ["planned", "applied", "approved", "blocked", "rejected"];

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

export async function POST(request: NextRequest, { params }: Props) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const form = await request.formData();
  const pipelineStatus = String(form.get("pipeline_status") ?? "").trim() as AffiliatePipelineStatus;

  if (!statuses.includes(pipelineStatus)) {
    return NextResponse.json({ error: "Invalid affiliate pipeline status." }, { status: 400 });
  }

  await updateAffiliateProgramStatus({
    id,
    pipeline_status: pipelineStatus,
    approved_url: optionalText(form.get("approved_url")),
    notes: optionalText(form.get("notes"))
  });

  return NextResponse.redirect(getSiteUrl("/admin?affiliate=updated"), 303);
}
