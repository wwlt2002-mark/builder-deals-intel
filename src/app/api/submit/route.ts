import { NextResponse } from "next/server";
import { honeypotFilled } from "@/lib/forms";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site-url";
import { appendSubmission } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(request, "submit", 6, 60 * 60 * 1000);

  if (limit.limited) {
    return rateLimitResponse(limit.resetAt);
  }

  const form = await request.formData();

  if (honeypotFilled(form, ["homepage"])) {
    return NextResponse.redirect(getSiteUrl("/submit?queued=1"), 303);
  }

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

  return NextResponse.redirect(getSiteUrl("/submit?queued=1"), 303);
}
