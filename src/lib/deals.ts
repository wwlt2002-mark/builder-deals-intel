import dealsJson from "../../data/deals.json";
import { getPool, hasDatabase } from "./db";
import type { Deal, DealCategory, DealStatus } from "./types";

const deals = dealsJson as Deal[];

function normalizeDeal(row: Record<string, unknown>): Deal {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    product_name: String(row.product_name),
    merchant: String(row.merchant),
    category: row.category as Deal["category"],
    original_price: row.original_price ? String(row.original_price) : null,
    deal_price: row.deal_price ? String(row.deal_price) : null,
    discount_summary: String(row.discount_summary),
    region: String(row.region),
    expires_at: row.expires_at ? new Date(String(row.expires_at)).toISOString() : null,
    source_url: String(row.source_url),
    deal_url: String(row.deal_url),
    affiliate_url: row.affiliate_url ? String(row.affiliate_url) : null,
    is_affiliate: Boolean(row.is_affiliate),
    source_type: row.source_type as Deal["source_type"],
    confidence_score: Number(row.confidence_score),
    risk_tags: Array.isArray(row.risk_tags) ? (row.risk_tags as string[]) : [],
    ai_summary: String(row.ai_summary),
    status: row.status as Deal["status"],
    last_checked_at: new Date(String(row.last_checked_at)).toISOString()
  };
}

export async function getAllDeals() {
  if (hasDatabase()) {
    const result = await getPool().query("select * from deals order by confidence_score desc, created_at desc");
    return result.rows.map(normalizeDeal);
  }

  return [...deals].sort((a, b) => b.confidence_score - a.confidence_score);
}

export async function getPublishedDeals() {
  return (await getAllDeals()).filter((deal) => deal.status === "auto_published");
}

export async function getReviewDeals() {
  return (await getAllDeals()).filter((deal) => deal.status === "needs_review");
}

export async function getDealsByCategory(category: DealCategory) {
  return (await getPublishedDeals()).filter((deal) => deal.category === category);
}

export async function getDealBySlug(slug: string) {
  return (await getAllDeals()).find((deal) => deal.slug === slug);
}

export async function getDealsByStatus(status: DealStatus) {
  return (await getAllDeals()).filter((deal) => deal.status === status);
}

export async function getFeaturedDeals(limit = 10) {
  return (await getPublishedDeals())
    .filter((deal) => deal.confidence_score >= 85)
    .slice(0, limit);
}

export function getDisclosureText(deal: Deal) {
  if (!deal.is_affiliate) {
    return "No affiliate relationship is currently attached to this listing.";
  }

  return "This listing may include an affiliate link. We may earn a commission if you purchase through it, at no extra cost to you.";
}
