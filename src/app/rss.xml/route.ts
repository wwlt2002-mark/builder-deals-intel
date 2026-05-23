import { buildRssFeed } from "@/lib/feed";
import { getFeaturedDeals } from "@/lib/deals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const deals = await getFeaturedDeals(25);

  return new Response(buildRssFeed(deals), {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300"
    }
  });
}
