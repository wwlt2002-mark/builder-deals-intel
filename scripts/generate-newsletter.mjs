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
const outputPath = path.join(root, "data", "newsletter-draft.md");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdealintel.com").replace(/\/$/, "");

async function loadDealsFromJson() {
  const dealsPath = path.join(root, "data", "deals.json");
  return JSON.parse(await fs.readFile(dealsPath, "utf8"));
}

async function loadDealsFromDatabase() {
  if (!process.env.DATABASE_URL) {
    return null;
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
    const result = await client.query(
      `select slug,
              title,
              deal_price,
              source_url,
              confidence_score,
              risk_tags,
              ai_summary,
              is_affiliate,
              affiliate_network,
              last_checked_at
       from deals
       where status = 'auto_published'
         and confidence_score >= 85
         and (expires_at is null or expires_at > now())
       order by confidence_score desc, last_checked_at desc
       limit 10`
    );

    return result.rows;
  } finally {
    await client.end();
  }
}

function normalizeDeal(deal) {
  return {
    ...deal,
    risk_tags: Array.isArray(deal.risk_tags) ? deal.risk_tags : [],
    confidence_score: Number(deal.confidence_score),
    is_affiliate: Boolean(deal.is_affiliate)
  };
}

const databaseDeals = await loadDealsFromDatabase();
const source = databaseDeals ? "postgres" : "json";
const deals = (databaseDeals ?? (await loadDealsFromJson())).map(normalizeDeal);
const featured = deals
  .filter((deal) => deal.confidence_score >= 85)
  .sort((a, b) => b.confidence_score - a.confidence_score)
  .slice(0, 10);

const body = [
  "# Top 10 Deals for Builders",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Source: ${source}`,
  "",
  ...featured.flatMap((deal, index) => [
    `## ${index + 1}. ${deal.title}`,
    "",
    deal.ai_summary,
    "",
    `- Price: ${deal.deal_price ?? "See terms"}`,
    `- Confidence: ${deal.confidence_score}%`,
    `- Open deal: ${siteUrl}/out/${deal.slug}?placement=newsletter_draft`,
    `- Verify source: ${deal.source_url}`,
    `- Risks: ${deal.risk_tags.join(", ") || "None listed"}`,
    `- Disclosure: ${
      deal.is_affiliate
        ? `May include an affiliate link${deal.affiliate_network ? ` through ${deal.affiliate_network}` : ""}.`
        : "No affiliate relationship currently attached."
    }`,
    ""
  ]),
  "Some links may be affiliate links. We may earn a commission at no extra cost to readers."
].join("\n");

await fs.writeFile(outputPath, body);
console.log(`Newsletter draft written to ${outputPath} from ${source}.`);
