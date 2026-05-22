import { NextResponse } from "next/server";
import { honeypotFilled } from "@/lib/forms";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { appendSponsorLead } from "@/lib/storage";

export const runtime = "nodejs";

function field(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

function optional(form: FormData, name: string) {
  const value = field(form, name);
  return value || null;
}

export async function POST(request: Request) {
  const limit = rateLimit(request, "sponsor", 5, 60 * 60 * 1000);

  if (limit.limited) {
    return rateLimitResponse(limit.resetAt);
  }

  const form = await request.formData();

  if (honeypotFilled(form, ["company_website"])) {
    return NextResponse.redirect(new URL("/sponsor?submitted=1", request.url), 303);
  }

  const company = field(form, "company");
  const email = field(form, "email");
  const website = optional(form, "website");

  if (!company || !email.includes("@")) {
    return NextResponse.json({ error: "Company and valid email are required." }, { status: 400 });
  }

  if (website && !URL.canParse(website)) {
    return NextResponse.json({ error: "Website must be a valid URL." }, { status: 400 });
  }

  await appendSponsorLead({
    id: crypto.randomUUID(),
    company,
    contact_name: optional(form, "contact_name"),
    email,
    website,
    offer_type: field(form, "offer_type") || "affiliate",
    budget: optional(form, "budget"),
    message: optional(form, "message"),
    status: "new",
    created_at: new Date().toISOString()
  });

  return NextResponse.redirect(new URL("/sponsor?submitted=1", request.url), 303);
}
