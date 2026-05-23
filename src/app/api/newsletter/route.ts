import { NextResponse } from "next/server";
import { honeypotFilled } from "@/lib/forms";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site-url";
import { appendSubscriber } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(request, "newsletter", 8, 60 * 60 * 1000);

  if (limit.limited) {
    return rateLimitResponse(limit.resetAt);
  }

  const form = await request.formData();

  if (honeypotFilled(form, ["name"])) {
    return NextResponse.redirect(getSiteUrl("/newsletter?subscribed=1"), 303);
  }

  const email = String(form.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  await appendSubscriber({
    id: crypto.randomUUID(),
    email,
    source: "site",
    created_at: new Date().toISOString()
  });

  return NextResponse.redirect(getSiteUrl("/newsletter?subscribed=1"), 303);
}
