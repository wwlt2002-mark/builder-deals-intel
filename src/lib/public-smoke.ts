export type PublicSmokeResult = {
  path: string;
  ok: boolean;
  status: number | null;
  expected: string;
  message: string;
};

const defaultSiteUrl = "https://builderdealintel.com";

export const publicSmokeChecks = [
  { path: "/", expected: "Today&#x27;s best builder deals" },
  { path: "/status", expected: "Public operating status" },
  { path: "/sponsor", expected: "Partner FAQ" },
  { path: "/partner-programs", expected: "Affiliate application profile" },
  { path: "/partner-programs/hostinger-affiliate-program", expected: "Affiliate fit profile" },
  { path: "/media-kit", expected: "Partner-ready media kit" },
  { path: "/advertise", expected: "Advertise to builders" },
  { path: "/commercial-proof", expected: "Public proof for affiliate managers" },
  { path: "/editorial-policy", expected: "Trust rules for deal intelligence" },
  { path: "/affiliate-compliance", expected: "Brand-safe promotion rules" },
  { path: "/hosting-deals", expected: "Hosting Deals, Domain Discounts" },
  { path: "/saas-discounts", expected: "SaaS Discounts and Startup Software" },
  { path: "/hosting-for-saas-projects", expected: "Best Hosting Deals for New SaaS Projects" },
  { path: "/newsletter-tools-for-builders", expected: "Best Newsletter Tools for Builders" },
  { path: "/automation-tools-for-ai-workflows", expected: "Best Automation Tools for AI Workflows" },
  { path: "/rss.xml", expected: "<rss" },
  { path: "/feed.json", expected: "jsonfeed" },
  { path: "/robots.txt", expected: "Sitemap: https://builderdealintel.com/sitemap.xml" },
  { path: "/api/health", expected: '"ok":true' }
];

export async function runPublicSmokeCheck(siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl) {
  const base = siteUrl.replace(/\/$/, "");
  const results: PublicSmokeResult[] = [];

  for (const check of publicSmokeChecks) {
    try {
      const response = await fetch(`${base}${check.path}`, {
        headers: {
          "user-agent": "BuilderDealsIntelSmoke/1.0"
        },
        signal: AbortSignal.timeout(15000)
      });
      const text = await response.text();
      const ok = response.ok && text.includes(check.expected);

      results.push({
        path: check.path,
        ok,
        status: response.status,
        expected: check.expected,
        message: ok ? "passed" : `missing expected text: ${check.expected}`
      });
    } catch (error) {
      results.push({
        path: check.path,
        ok: false,
        status: null,
        expected: check.expected,
        message: error instanceof Error ? error.message : "unknown smoke check error"
      });
    }
  }

  return {
    ok: results.every((result) => result.ok),
    checked_at: new Date().toISOString(),
    site_url: base,
    results
  };
}
