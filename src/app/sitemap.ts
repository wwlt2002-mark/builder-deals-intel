import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getAllDeals } from "@/lib/deals";
import { moneyPages } from "@/lib/money-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdeals.example.com";
  const staticRoutes = ["", "/submit", "/newsletter", "/newsletter/archive", "/sponsor"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));

  const moneyRoutes = moneyPages.map((page) => ({
    url: `${siteUrl}/${page.slug}`,
    lastModified: new Date()
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/categories/${category.id}`,
    lastModified: new Date()
  }));

  const dealRoutes = (await getAllDeals()).map((deal) => ({
    url: `${siteUrl}/deals/${deal.slug}`,
    lastModified: new Date(deal.last_checked_at)
  }));

  return [...staticRoutes, ...moneyRoutes, ...categoryRoutes, ...dealRoutes];
}
