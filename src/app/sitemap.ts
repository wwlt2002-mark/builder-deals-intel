import type { MetadataRoute } from "next";
import { affiliatePrograms, getAffiliateProgramId } from "@/lib/affiliate-programs";
import { categories } from "@/lib/categories";
import { getPublishedDeals } from "@/lib/deals";
import { moneyPages } from "@/lib/money-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdealintel.com";
  const staticRoutes = [
    { route: "", priority: 1 },
    { route: "/daily-brief", priority: 0.9 },
    { route: "/newsletter", priority: 0.8 },
    { route: "/newsletter/archive", priority: 0.7 },
    { route: "/submit", priority: 0.6 },
    { route: "/rss.xml", priority: 0.5 },
    { route: "/feed.json", priority: 0.5 },
    { route: "/contact", priority: 0.6 },
    { route: "/sponsor", priority: 0.7 },
    { route: "/status", priority: 0.7 },
    { route: "/partner-programs", priority: 0.8 },
    { route: "/media-kit", priority: 0.7 },
    { route: "/advertise", priority: 0.6 },
    { route: "/commercial-proof", priority: 0.8 },
    { route: "/editorial-policy", priority: 0.5 },
    { route: "/affiliate-compliance", priority: 0.5 },
    { route: "/affiliate-disclosure", priority: 0.5 },
    { route: "/privacy", priority: 0.4 }
  ].map(({ route, priority }) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/daily-brief" ? "daily" : "weekly",
    priority
  }));

  const moneyRoutes = moneyPages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9
  }));

  const partnerProgramRoutes = affiliatePrograms.map((program) => ({
    url: `${siteUrl}/partner-programs/${getAffiliateProgramId(program.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/categories/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8
  }));

  const dealRoutes = (await getPublishedDeals()).map((deal) => ({
    url: `${siteUrl}/deals/${deal.slug}`,
    lastModified: new Date(deal.last_checked_at),
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [...staticRoutes, ...moneyRoutes, ...partnerProgramRoutes, ...categoryRoutes, ...dealRoutes];
}
