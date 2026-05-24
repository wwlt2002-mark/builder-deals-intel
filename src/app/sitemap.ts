import type { MetadataRoute } from "next";
import { affiliatePrograms, getAffiliateProgramId } from "@/lib/affiliate-programs";
import { categories } from "@/lib/categories";
import { getPublishedDeals } from "@/lib/deals";
import { moneyPages } from "@/lib/money-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdealintel.com";
  const staticRoutes = [
    "",
    "/submit",
    "/newsletter",
    "/newsletter/archive",
    "/rss.xml",
    "/feed.json",
    "/contact",
    "/sponsor",
    "/status",
    "/partner-programs",
    "/media-kit",
    "/advertise",
    "/commercial-proof",
    "/editorial-policy",
    "/affiliate-compliance",
    "/affiliate-disclosure",
    "/privacy"
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));

  const moneyRoutes = moneyPages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date()
  }));

  const partnerProgramRoutes = affiliatePrograms.map((program) => ({
    url: `${siteUrl}/partner-programs/${getAffiliateProgramId(program.name)}`,
    lastModified: new Date()
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/categories/${category.id}`,
    lastModified: new Date()
  }));

  const dealRoutes = (await getPublishedDeals()).map((deal) => ({
    url: `${siteUrl}/deals/${deal.slug}`,
    lastModified: new Date(deal.last_checked_at)
  }));

  return [...staticRoutes, ...moneyRoutes, ...partnerProgramRoutes, ...categoryRoutes, ...dealRoutes];
}
