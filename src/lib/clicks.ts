import { getPool, hasDatabase } from "./db";

export type OutboundClickInput = {
  deal_id: string | null;
  slug: string;
  destination_url: string;
  is_affiliate: boolean;
  affiliate_network: string | null;
  placement: string;
  campaign: string | null;
  referrer: string | null;
  user_agent: string | null;
};

export async function recordOutboundClick(input: OutboundClickInput) {
  if (!hasDatabase()) {
    return;
  }

  await getPool().query(
    `insert into outbound_clicks (
       deal_id,
       slug,
       destination_url,
       is_affiliate,
       affiliate_network,
       placement,
       campaign,
       referrer,
       user_agent
     ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      input.deal_id,
      input.slug,
      input.destination_url,
      input.is_affiliate,
      input.affiliate_network,
      input.placement,
      input.campaign,
      input.referrer,
      input.user_agent
    ]
  );
}

export async function getClickStats() {
  if (!hasDatabase()) {
    return {
      total: 0,
      affiliate: 0,
      last24h: 0
    };
  }

  const result = await getPool().query(
    `select
       count(*)::int as total,
       count(*) filter (where is_affiliate)::int as affiliate,
       count(*) filter (where created_at >= now() - interval '24 hours')::int as last24h
     from outbound_clicks`
  );

  return {
    total: Number(result.rows[0]?.total ?? 0),
    affiliate: Number(result.rows[0]?.affiliate ?? 0),
    last24h: Number(result.rows[0]?.last24h ?? 0)
  };
}

export type TopClickedDeal = {
  slug: string;
  title: string;
  merchant: string;
  clicks: number;
  affiliate_clicks: number;
  last_click_at: string | null;
};

export async function getTopClickedDeals(limit = 8): Promise<TopClickedDeal[]> {
  if (!hasDatabase()) {
    return [];
  }

  const result = await getPool().query(
    `select
       oc.slug,
       coalesce(d.title, oc.slug) as title,
       coalesce(d.merchant, 'Unknown') as merchant,
       count(*)::int as clicks,
       count(*) filter (where oc.is_affiliate)::int as affiliate_clicks,
       max(oc.created_at) as last_click_at
     from outbound_clicks oc
     left join deals d on d.id = oc.deal_id
     group by oc.slug, d.title, d.merchant
     order by clicks desc, last_click_at desc
     limit $1`,
    [limit]
  );

  return result.rows.map((row) => ({
    slug: String(row.slug),
    title: String(row.title),
    merchant: String(row.merchant),
    clicks: Number(row.clicks),
    affiliate_clicks: Number(row.affiliate_clicks),
    last_click_at: row.last_click_at ? new Date(String(row.last_click_at)).toISOString() : null
  }));
}

export type TopClickPlacement = {
  placement: string;
  clicks: number;
  affiliate_clicks: number;
  last_click_at: string | null;
};

export async function getTopClickPlacements(limit = 6): Promise<TopClickPlacement[]> {
  if (!hasDatabase()) {
    return [];
  }

  const result = await getPool().query(
    `select
       coalesce(nullif(placement, ''), 'unknown') as placement,
       count(*)::int as clicks,
       count(*) filter (where is_affiliate)::int as affiliate_clicks,
       max(created_at) as last_click_at
     from outbound_clicks
     group by coalesce(nullif(placement, ''), 'unknown')
     order by clicks desc, last_click_at desc
     limit $1`,
    [limit]
  );

  return result.rows.map((row) => ({
    placement: String(row.placement),
    clicks: Number(row.clicks),
    affiliate_clicks: Number(row.affiliate_clicks),
    last_click_at: row.last_click_at ? new Date(String(row.last_click_at)).toISOString() : null
  }));
}

export type TopClickCampaign = {
  campaign: string;
  clicks: number;
  affiliate_clicks: number;
  last_click_at: string | null;
};

export async function getTopClickCampaigns(limit = 6): Promise<TopClickCampaign[]> {
  if (!hasDatabase()) {
    return [];
  }

  const result = await getPool().query(
    `select
       coalesce(nullif(campaign, ''), 'uncampaignized') as campaign,
       count(*)::int as clicks,
       count(*) filter (where is_affiliate)::int as affiliate_clicks,
       max(created_at) as last_click_at
     from outbound_clicks
     group by coalesce(nullif(campaign, ''), 'uncampaignized')
     order by clicks desc, last_click_at desc
     limit $1`,
    [limit]
  );

  return result.rows.map((row) => ({
    campaign: String(row.campaign),
    clicks: Number(row.clicks),
    affiliate_clicks: Number(row.affiliate_clicks),
    last_click_at: row.last_click_at ? new Date(String(row.last_click_at)).toISOString() : null
  }));
}
