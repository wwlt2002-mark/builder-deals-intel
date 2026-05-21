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

  if (!deal) {
    return NextResponse.redirect(new URL("/", request.url), 302);
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

  return NextResponse.redirect(destination, 302);
}
