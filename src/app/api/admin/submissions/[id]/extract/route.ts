import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { extractSubmittedDeal } from "@/lib/ai-extract";
import { createDeal } from "@/lib/deals";
import { getSiteUrl } from "@/lib/site-url";
import { attachGeneratedDealToSubmission, getSubmissionById } from "@/lib/storage";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const candidate = await extractSubmittedDeal({
    submittedUrl: submission.submitted_url,
    note: submission.submitter_note,
    relationship: submission.relationship
  });
  const dealId = await createDeal(candidate);

  await attachGeneratedDealToSubmission(id, dealId);

  return NextResponse.redirect(getSiteUrl(`/admin/deals/${dealId}`), 303);
}
