import { NextResponse } from "next/server";
import { honeypotFilled } from "@/lib/forms";
import { appendSubscriber } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();

  if (honeypotFilled(form, ["name"])) {
    return NextResponse.redirect(new URL("/newsletter?subscribed=1", request.url), 303);
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

  return NextResponse.redirect(new URL("/newsletter?subscribed=1", request.url), 303);
}
