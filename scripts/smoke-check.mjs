const siteUrl = (process.env.SMOKE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://builderdealintel.com").replace(
  /\/$/,
  ""
);

const checks = [
  {
    path: "/",
    mustContain: "Today&#x27;s best builder deals"
  },
  {
    path: "/status",
    mustContain: "Public operating status"
  },
  {
    path: "/sponsor",
    mustContain: "Start a partnership"
  },
  {
    path: "/hosting-deals",
    mustContain: "Hosting Deals, Domain Discounts"
  },
  {
    path: "/saas-discounts",
    mustContain: "SaaS Discounts and Startup Software"
  },
  {
    path: "/rss.xml",
    mustContain: "<rss"
  },
  {
    path: "/feed.json",
    mustContain: "jsonfeed"
  },
  {
    path: "/robots.txt",
    mustContain: "Sitemap: https://builderdealintel.com/sitemap.xml"
  },
  {
    path: "/api/health",
    mustContain: '"ok":true'
  }
];

async function fetchText(path) {
  const response = await fetch(`${siteUrl}${path}`, {
    headers: {
      "user-agent": "BuilderDealsIntelSmoke/1.0"
    },
    signal: AbortSignal.timeout(15000)
  });
  const text = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    text
  };
}

const failures = [];

for (const check of checks) {
  try {
    const result = await fetchText(check.path);

    if (!result.ok || !result.text.includes(check.mustContain)) {
      failures.push(`${check.path} returned ${result.status} without ${check.mustContain}`);
      continue;
    }

    console.log(`[smoke] ok ${check.path}`);
  } catch (error) {
    failures.push(`${check.path} failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failures.length) {
  console.error("[smoke] failed");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`[smoke] passed ${checks.length} checks against ${siteUrl}`);
