import crypto from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
let pg = null;

try {
  pg = require("pg");
} catch {
  pg = null;
}

const root = process.cwd();
const sourcesPath = path.join(root, "data", "sources.json");

const sources = JSON.parse(await fs.readFile(sourcesPath, "utf8"));

function classifySource(source) {
  const baseScore = {
    official: 88,
    trusted_community: 72,
    open_web: 58,
    user_submission: 45
  }[source.source_type];

  const confidence = Math.min(100, baseScore + (source.source_type === "official" ? 6 : 0));
  const status = confidence >= source.auto_publish_threshold ? "auto_published" : "needs_review";

  return {
    source: source.name,
    url: source.url,
    category: source.category,
    source_type: source.source_type,
    confidence,
    status
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function inferRiskTags(source) {
  const tags = [];

  if (source.source_type !== "official") {
    tags.push("needs-review");
  }

  if (/pricing|free|credits?|trial/i.test(source.url)) {
    tags.push("usage-limits");
  }

  if (/appsumo|producthunt|news\.ycombinator/i.test(source.url)) {
    tags.push("rotating-offers", "quality-varies");
  }

  return [...new Set(tags)];
}

function buildDealCandidate(source) {
  const classified = classifySource(source);
  const riskTags = inferRiskTags(source);
  const status =
    classified.status === "auto_published" && !riskTags.includes("needs-review") ? "auto_published" : "needs_review";
  const hash = crypto.createHash("sha1").update(source.url).digest("hex").slice(0, 8);
  const productName = source.name.replace(/\s+(Pricing|Program|Pack)$/i, "");

  return {
    slug: `${slugify(source.name)}-${hash}`,
    title: `${source.name} monitored deal source`,
    product_name: productName,
    merchant: productName,
    category: source.category,
    original_price: null,
    deal_price: "See source",
    discount_summary: `Monitored ${source.source_type.replace("_", " ")} source for builder-relevant offers.`,
    region: "Global, terms vary",
    expires_at: null,
    source_url: source.url,
    deal_url: source.url,
    affiliate_url: null,
    is_affiliate: false,
    affiliate_network: null,
    affiliate_program: null,
    affiliate_status: "none",
    affiliate_notes: null,
    source_type: source.source_type,
    confidence_score: classified.confidence,
    risk_tags: riskTags,
    ai_summary:
      source.source_type === "official"
        ? `Official source monitored for current ${source.category.replace("_", " ")} offers. Publishable when price, eligibility, and billing terms are clear.`
        : `Community or marketplace source monitored for possible offers. Keep items in review until a specific official deal page is verified.`,
    status,
    last_checked_at: new Date().toISOString()
  };
}

async function upsertToDatabase(candidates) {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  if (!pg) {
    throw new Error("The pg package is required when DATABASE_URL is set.");
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost")
      ? false
      : {
          rejectUnauthorized: false
        }
  });

  await client.connect();
  try {
    for (const source of sources) {
      await client.query(
        `insert into sources (
           name,
           url,
           category,
           source_type,
           auto_publish_threshold,
           enabled
         ) values ($1, $2, $3, $4, $5, true)
         on conflict (url) do update
         set name = excluded.name,
             category = excluded.category,
             source_type = excluded.source_type,
             auto_publish_threshold = excluded.auto_publish_threshold`,
        [source.name, source.url, source.category, source.source_type, source.auto_publish_threshold]
      );
    }

    for (const deal of candidates) {
      await client.query(
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
           $21, $22, $23, $24
         )
         on conflict (slug) do update
         set confidence_score = excluded.confidence_score,
             risk_tags = excluded.risk_tags,
             status = case
               when deals.status in ('rejected', 'expired') then deals.status
               else excluded.status
             end,
             last_checked_at = excluded.last_checked_at,
             updated_at = now()`,
        [
          deal.slug,
          deal.title,
          deal.product_name,
          deal.merchant,
          deal.category,
          deal.original_price,
          deal.deal_price,
          deal.discount_summary,
          deal.region,
          deal.expires_at,
          deal.source_url,
          deal.deal_url,
          deal.affiliate_url,
          deal.is_affiliate,
          deal.affiliate_network,
          deal.affiliate_program,
          deal.affiliate_status,
          deal.affiliate_notes,
          deal.source_type,
          deal.confidence_score,
          deal.risk_tags,
          deal.ai_summary,
          deal.status,
          deal.last_checked_at
        ]
      );

      await client.query("update sources set last_checked_at = now() where url = $1", [deal.source_url]);
    }
  } finally {
    await client.end();
  }

  return true;
}

const report = sources.map(classifySource);
const candidates = sources.map(buildDealCandidate);
const wroteDatabase = await upsertToDatabase(candidates);

console.table(report);
console.log(
  wroteDatabase
    ? `\nUpserted ${candidates.length} monitored source candidates into Postgres.`
    : "\nDry run only. Set DATABASE_URL to upsert monitored source candidates into Postgres."
);
