import dealsJson from "../../data/deals.json";
import { getPool, hasDatabase } from "./db";
import { slugify } from "./slug";
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
    affiliate_network: row.affiliate_network ? String(row.affiliate_network) : null,
    affiliate_program: row.affiliate_program ? String(row.affiliate_program) : null,
    affiliate_status: row.affiliate_status ? String(row.affiliate_status) : row.is_affiliate ? "active" : "none",
    affiliate_notes: row.affiliate_notes ? String(row.affiliate_notes) : null,
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

  const network = deal.affiliate_network ? ` through ${deal.affiliate_network}` : "";
  return `This listing may include an affiliate link${network}. We may earn a commission if you purchase through it, at no extra cost to you.`;
}

export type DealUpdateInput = {
  title: string;
  product_name: string;
  merchant: string;
  category: DealCategory;
  original_price: string | null;
  deal_price: string | null;
  discount_summary: string;
  region: string;
  expires_at: string | null;
  source_url: string;
  deal_url: string;
  affiliate_url: string | null;
  is_affiliate: boolean;
  affiliate_network: string | null;
  affiliate_program: string | null;
  affiliate_status: string;
  affiliate_notes: string | null;
  source_type: Deal["source_type"];
  confidence_score: number;
  risk_tags: string[];
  ai_summary: string;
  status: DealStatus;
};

export async function createDeal(input: DealUpdateInput) {
  if (!hasDatabase()) {
    throw new Error("Database is required to create deals.");
  }

  const baseSlug = slugify(`${input.product_name}-${input.discount_summary}`) || slugify(input.title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const result = await getPool().query(
    `insert into deals (
       slug,
       title,
       product_name,
       merchant,
       category,
       original_price,
       deal_price,
       discount_summary,
       region,
       expires_at,
       source_url,
       deal_url,
       affiliate_url,
       is_affiliate,
       affiliate_network,
       affiliate_program,
       affiliate_status,
       affiliate_notes,
       source_type,
       confidence_score,
       risk_tags,
       ai_summary,
       status,
       last_checked_at
     ) values (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
       $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
       $21, $22, $23, now()
     )
     returning id`,
    [
      slug,
      input.title,
      input.product_name,
      input.merchant,
      input.category,
      input.original_price,
      input.deal_price,
      input.discount_summary,
      input.region,
      input.expires_at,
      input.source_url,
      input.deal_url,
      input.affiliate_url,
      input.is_affiliate,
      input.affiliate_network,
      input.affiliate_program,
      input.affiliate_status,
      input.affiliate_notes,
      input.source_type,
      input.confidence_score,
      input.risk_tags,
      input.ai_summary,
      input.status
    ]
  );

  return String(result.rows[0].id);
}

export async function updateDeal(id: string, input: DealUpdateInput) {
  if (!hasDatabase()) {
    throw new Error("Database is required to update deals.");
  }

  await getPool().query(
    `update deals
     set title = $2,
         product_name = $3,
         merchant = $4,
         category = $5,
         original_price = $6,
         deal_price = $7,
         discount_summary = $8,
         region = $9,
         expires_at = $10,
         source_url = $11,
         deal_url = $12,
         affiliate_url = $13,
         is_affiliate = $14,
         affiliate_network = $15,
         affiliate_program = $16,
         affiliate_status = $17,
         affiliate_notes = $18,
         source_type = $19,
         confidence_score = $20,
         risk_tags = $21,
         ai_summary = $22,
         status = $23,
         last_checked_at = now(),
         updated_at = now()
     where id = $1`,
    [
      id,
      input.title,
      input.product_name,
      input.merchant,
      input.category,
      input.original_price,
      input.deal_price,
      input.discount_summary,
      input.region,
      input.expires_at,
      input.source_url,
      input.deal_url,
      input.affiliate_url,
      input.is_affiliate,
      input.affiliate_network,
      input.affiliate_program,
      input.affiliate_status,
      input.affiliate_notes,
      input.source_type,
      input.confidence_score,
      input.risk_tags,
      input.ai_summary,
      input.status
    ]
  );
}

export async function updateDealStatus(id: string, status: DealStatus) {
  if (!hasDatabase()) {
    throw new Error("Database is required to update deal status.");
  }

  await getPool().query(
    "update deals set status = $2, last_checked_at = now(), updated_at = now() where id = $1",
    [id, status]
  );
}

export async function expirePastDeals() {
  if (!hasDatabase()) {
    return { expired: 0 };
  }

  const result = await getPool().query(
    `update deals
     set status = 'expired',
         updated_at = now(),
         last_checked_at = now()
     where status in ('draft', 'auto_published', 'needs_review')
       and expires_at is not null
       and expires_at <= now()
     returning id`
  );

  return { expired: result.rowCount ?? 0 };
}
