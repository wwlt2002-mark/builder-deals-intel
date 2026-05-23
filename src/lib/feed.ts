import type { Deal } from "./types";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdealintel.com").replace(/\/$/, "");

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dealDescription(deal: Deal) {
  return [
    deal.ai_summary,
    `Price: ${deal.deal_price ?? "See terms"}.`,
    `Confidence: ${deal.confidence_score}%.`,
    `Risks: ${deal.risk_tags.join(", ") || "None listed"}.`,
    `Source: ${deal.source_url}.`
  ].join(" ");
}

export function buildRssFeed(deals: Deal[]) {
  const items = deals
    .slice(0, 25)
    .map((deal) => {
      const link = `${siteUrl}/deals/${deal.slug}`;
      const outbound = `${siteUrl}/out/${deal.slug}?placement=rss`;

      return [
        "    <item>",
        `      <title>${escapeXml(deal.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${new Date(deal.last_checked_at).toUTCString()}</pubDate>`,
        `      <category>${escapeXml(deal.category)}</category>`,
        `      <description>${escapeXml(`${dealDescription(deal)} Open tracked deal: ${outbound}`)}</description>`,
        "    </item>"
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8" ?>',
    '<rss version="2.0">',
    "  <channel>",
    "    <title>Builder Deals Intel</title>",
    `    <link>${siteUrl}</link>`,
    "    <description>Daily AI, SaaS, hosting, cloud, and developer deals intelligence for builders.</description>",
    "    <language>en-us</language>",
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>"
  ].join("\n");
}

export function buildJsonFeed(deals: Deal[]) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: "Builder Deals Intel",
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: "Daily AI, SaaS, hosting, cloud, and developer deals intelligence for builders.",
    items: deals.slice(0, 25).map((deal) => ({
      id: `${siteUrl}/deals/${deal.slug}`,
      url: `${siteUrl}/deals/${deal.slug}`,
      title: deal.title,
      summary: dealDescription(deal),
      content_text: `${dealDescription(deal)} Open tracked deal: ${siteUrl}/out/${deal.slug}?placement=json_feed`,
      date_modified: deal.last_checked_at,
      tags: [deal.category, deal.source_type, ...deal.risk_tags]
    }))
  };
}
