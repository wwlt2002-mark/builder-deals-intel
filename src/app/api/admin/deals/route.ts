import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { normalizeAffiliateFields, validateAffiliateFields } from "@/lib/admin-deal-form";
import { createDeal } from "@/lib/deals";
import { getSiteUrl } from "@/lib/site-url";
import type { DealCategory, DealStatus, SourceType } from "@/lib/types";

export const runtime = "nodejs";

const categories = new Set<DealCategory>(["ai_tools", "saas", "developer_tools", "cloud_credits", "hosting"]);
const statuses = new Set<DealStatus>(["draft", "auto_published", "needs_review", "rejected", "expired"]);
const sourceTypes = new Set<SourceType>(["official", "trusted_community", "open_web", "user_submission"]);

function text(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function nullable(value: FormDataEntryValue | null) {
  const result = text(value);
  return result ? result : null;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const form = await request.formData();
  const category = text(form.get("category")) as DealCategory;
  const status = text(form.get("status")) as DealStatus;
  const sourceType = text(form.get("source_type")) as SourceType;
  const confidenceScore = Number(text(form.get("confidence_score")) || 50);

  if (!categories.has(category) || !statuses.has(status) || !sourceTypes.has(sourceType)) {
    return NextResponse.json({ error: "Invalid enum value." }, { status: 400 });
  }

  if (!Number.isInteger(confidenceScore) || confidenceScore < 0 || confidenceScore > 100) {
    return NextResponse.json({ error: "Confidence score must be 0-100." }, { status: 400 });
  }

  const input = normalizeAffiliateFields({
    title: text(form.get("title")),
    product_name: text(form.get("product_name")),
    merchant: text(form.get("merchant")),
    category,
    original_price: nullable(form.get("original_price")),
    deal_price: nullable(form.get("deal_price")),
    discount_summary: text(form.get("discount_summary")),
    region: text(form.get("region")) || "Global",
    expires_at: nullable(form.get("expires_at")),
    source_url: text(form.get("source_url")),
    deal_url: text(form.get("deal_url")),
    affiliate_url: nullable(form.get("affiliate_url")),
    is_affiliate: form.get("is_affiliate") === "on",
    affiliate_network: nullable(form.get("affiliate_network")),
    affiliate_program: nullable(form.get("affiliate_program")),
    affiliate_status: text(form.get("affiliate_status")) || "none",
    affiliate_notes: nullable(form.get("affiliate_notes")),
    source_type: sourceType,
    confidence_score: confidenceScore,
    risk_tags: text(form.get("risk_tags"))
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    ai_summary: text(form.get("ai_summary")),
    status
  });

  const affiliateErrors = validateAffiliateFields(input);

  if (affiliateErrors.length) {
    return NextResponse.json({ error: affiliateErrors.join(" ") }, { status: 400 });
  }

  const id = await createDeal(input);

  return NextResponse.redirect(getSiteUrl(`/admin/deals/${id}`), 303);
}
