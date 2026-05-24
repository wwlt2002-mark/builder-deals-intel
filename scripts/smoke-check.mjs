import { runPublicSmokeCheck } from "../src/lib/public-smoke.ts";

const siteUrl = process.env.SMOKE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://builderdealintel.com";
const smoke = await runPublicSmokeCheck(siteUrl);

for (const result of smoke.results) {
  console.log(`[smoke] ${result.ok ? "ok" : "fail"} ${result.path}`);
}

if (!smoke.ok) {
  console.error("[smoke] failed");
  for (const result of smoke.results.filter((item) => !item.ok)) {
    console.error(`- ${result.path} returned ${result.status ?? "no response"}: ${result.message}`);
  }
  process.exit(1);
}

console.log(`[smoke] passed ${smoke.results.length} checks against ${smoke.site_url}`);
