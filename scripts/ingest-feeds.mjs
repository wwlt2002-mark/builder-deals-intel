import fs from "node:fs/promises";
import path from "node:path";

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

const report = sources.map(classifySource);

console.table(report);
console.log("\nNext step: replace this dry-run classifier with fetch + AI extraction once API keys are configured.");
