import { getFeaturedDeals } from "@/lib/deals";
import { buildJsonFeed } from "@/lib/feed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const deals = await getFeaturedDeals(25);

  return Response.json(buildJsonFeed(deals), {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=300"
    }
  });
}
