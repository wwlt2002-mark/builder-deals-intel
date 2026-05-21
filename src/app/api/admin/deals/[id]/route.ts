import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin";
import { updateDeal, updateDealStatus } from "@/lib/deals";
import type { DealCategory, DealStatus, SourceType } from "@/lib/types";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

const categories = new Set<DealCategory>(["ai_tools", "saas", "developer_tools", "cloud_credits", "hosting"]);
const statuses = new Set<DealStatus>(["draft", "auto_published", "needs_review", "rejected", "expired"]);
const sourceTypes = new Set<SourceType>(["official", "trusted_community", "open_web", "user_submission"]);

function nullable(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function required(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function POST(request: NextRequest, { params }: Props) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const form = await request.formData();
  const action = required(form.get("action"));

  if (action === "status") {
    const status = required(form.get("status")) as DealStatus;

    if (!statuses.has(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await updateDealStatus(id, status);
    return NextResponse.redirect(new URL("/admin", request.url), 303);
  }

  const category = required(form.get("category")) as DealCategory;
  const status = required(form.get("status")) as DealStatus;
  const sourceType = required(form.get("source_type")) as SourceType;
  const confidenceScore = Number(required(form.get("confidence_score")));

  if (!categories.has(category) || !statuses.has(status) || !sourceTypes.has(sourceType)) {
    return NextResponse.json({ error: "Invalid enum value." }, { status: 400 });
  }

  if (!Number.isInteger(confidenceScore) || confidenceScore < 0 || confidenceScore > 100) {
    return NextResponse.json({ error: "Confidence score must be 0-100." }, { status: 400 });
  }

  await updateDeal(id, {
    title: required(form.get("title")),
    product_name: required(form.get("product_name")),
    merchant: required(form.get("merchant")),
    category,
    original_price: nullable(form.get("original_price")),
    deal_price: nullable(form.get("deal_price")),
    discount_summary: required(form.get("discount_summary")),
    region: required(form.get("region")) || "Global",
    expires_at: nullable(form.get("expires_at")),
    source_url: required(form.get("source_url")),
    deal_url: required(form.get("deal_url")),
    affiliate_url: nullable(form.get("affiliate_url")),
    is_affiliate: form.get("is_affiliate") === "on",
    source_type: sourceType,
    confidence_score: confidenceScore,
    risk_tags: required(form.get("risk_tags"))
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    ai_summary: required(form.get("ai_summary")),
    status
  });

  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
