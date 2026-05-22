import { NextRequest, NextResponse } from "next/server";
import { recordOutboundClick } from "@/lib/clicks";
import { getDealBySlug } from "@/lib/deals";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal || deal.status !== "auto_published") {
    return noIndexRedirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin));
  }

  const destination = deal.affiliate_url ?? deal.deal_url;
  const placement = request.nextUrl.searchParams.get("placement") || "deal_detail";
  const campaign = request.nextUrl.searchParams.get("campaign");

  await recordOutboundClick({
    deal_id: deal.id,
    slug: deal.slug,
    destination_url: destination,
    is_affiliate: deal.is_affiliate,
    affiliate_network: deal.affiliate_network,
    placement,
    campaign,
    referrer: request.headers.get("referer"),
    user_agent: request.headers.get("user-agent")
  });

  return noIndexRedirect(destination);
}

function noIndexRedirect(destination: string | URL) {
  const response = NextResponse.redirect(destination, 302);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}
