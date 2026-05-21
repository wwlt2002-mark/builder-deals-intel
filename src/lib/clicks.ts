import { getPool, hasDatabase } from "./db";

export type OutboundClickInput = {
  deal_id: string | null;
  slug: string;
  destination_url: string;
  is_affiliate: boolean;
  affiliate_network: string | null;
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
       referrer,
       user_agent
     ) values ($1, $2, $3, $4, $5, $6, $7)`,
    [
      input.deal_id,
      input.slug,
      input.destination_url,
      input.is_affiliate,
      input.affiliate_network,
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
