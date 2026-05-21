import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dealsPath = path.join(root, "data", "deals.json");
const outputPath = path.join(root, "data", "newsletter-draft.md");

const deals = JSON.parse(await fs.readFile(dealsPath, "utf8"));
const featured = deals
  .filter((deal) => deal.status === "auto_published" && deal.confidence_score >= 85)
  .sort((a, b) => b.confidence_score - a.confidence_score)
  .slice(0, 10);

const body = [
  "# Top 10 Deals for Builders",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  ...featured.flatMap((deal, index) => [
    `## ${index + 1}. ${deal.title}`,
    "",
    deal.ai_summary,
    "",
    `- Price: ${deal.deal_price ?? "See terms"}`,
    `- Confidence: ${deal.confidence_score}%`,
    `- Source: ${deal.source_url}`,
    `- Risks: ${deal.risk_tags.join(", ") || "None listed"}`,
    ""
  ]),
  "Some links may be affiliate links. We may earn a commission at no extra cost to readers."
].join("\n");

await fs.writeFile(outputPath, body);
console.log(`Newsletter draft written to ${outputPath}`);
