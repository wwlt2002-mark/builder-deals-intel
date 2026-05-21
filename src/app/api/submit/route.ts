import { NextResponse } from "next/server";
import { appendSubmission } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const url = String(form.get("url") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const relationship = String(form.get("relationship") ?? "I am not affiliated with this merchant");
  const note = String(form.get("note") ?? "").trim();

  if (!url || !URL.canParse(url)) {
    return NextResponse.json({ error: "A valid source URL is required." }, { status: 400 });
  }

  await appendSubmission({
    id: crypto.randomUUID(),
    submitted_url: url,
    submitter_email: email || null,
    relationship,
    submitter_note: note || null,
    status: "queued",
    created_at: new Date().toISOString()
  });

  return NextResponse.redirect(new URL("/submit?queued=1", request.url), 303);
}
