import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getAllDeals } from "@/lib/deals";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdeals.example.com";
  const staticRoutes = ["", "/submit", "/newsletter", "/sponsor"].map((route) => ({
    url: `${siteUrl}${route}`,
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

  return [...staticRoutes, ...categoryRoutes, ...dealRoutes];
}
