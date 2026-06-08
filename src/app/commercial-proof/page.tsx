import Link from "next/link";
import { getClickStats, getTopClickCampaigns, getTopClickedDeals, getTopClickPlacements } from "@/lib/clicks";
import { getFeaturedDeals } from "@/lib/deals";
import { getSubscriberStats } from "@/lib/storage";

export const metadata = {
  title: "Commercial Proof | Builder Deals Intel",
  description:
    "Public commercial proof for Builder Deals Intel, including outbound click tracking, newsletter growth, and sponsor-ready buyer intent.",
  alternates: {
    canonical: "/commercial-proof"
  },
  openGraph: {
    title: "Commercial Proof | Builder Deals Intel",
    description:
      "Outbound click tracking, newsletter growth, and sponsor-ready buyer intent signals for Builder Deals Intel.",
    url: "/commercial-proof",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Commercial Proof | Builder Deals Intel",
    description: "Public click, subscriber, and sponsor-readiness signals for Builder Deals Intel."
  }
};

export const dynamic = "force-dynamic";

export default async function CommercialProofPage() {
  const [clickStats, topDeals, topPlacements, topCampaigns, subscriberStats, featuredDeals] = await Promise.all([
    getClickStats(),
    getTopClickedDeals(5),
    getTopClickPlacements(5),
    getTopClickCampaigns(5),
    getSubscriberStats(),
    getFeaturedDeals(6)
  ]);

  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Commercial proof</span>
        <h1>Public proof for affiliate managers and sponsor buyers.</h1>
        <p>
          This report shows whether Builder Deals Intel is turning source-backed deal pages into measurable buyer
          intent. It is intentionally conservative while traffic is still building.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/sponsor">
            Start partnership
          </Link>
          <Link className="secondary-button" href="/media-kit">
            Media kit
          </Link>
        </div>
      </section>

      <section className="metric-row">
        <div className="metric">
          <strong>{clickStats.total}</strong>
          <span>tracked outbound clicks</span>
        </div>
        <div className="metric">
          <strong>{clickStats.affiliate}</strong>
          <span>affiliate clicks</span>
        </div>
        <div className="metric">
          <strong>{clickStats.last24h}</strong>
          <span>clicks in 24h</span>
        </div>
        <div className="metric">
          <strong>{subscriberStats.total}</strong>
          <span>newsletter subscribers</span>
        </div>
        <div className="metric">
          <strong>{subscriberStats.last7d}</strong>
          <span>subscriber adds in 7d</span>
        </div>
        <div className="metric">
          <strong>{featuredDeals.length}</strong>
          <span>high-confidence proof listings</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Measurement policy</h2>
            <p>Partners get signal without hidden redirects or unverifiable traffic claims.</p>
          </div>
        </div>
        <div className="policy-grid table-panel">
          <div>
            <strong>Tracked</strong>
            <span>Outbound clicks by deal, placement, campaign, affiliate flag, network, referrer, and timestamp.</span>
          </div>
          <div>
            <strong>Disclosed</strong>
            <span>Affiliate and sponsored links remain labeled, with source URLs preserved for verification.</span>
          </div>
          <div>
            <strong>Conservative</strong>
            <span>Traffic is reported as observed behavior, not inflated reach, impressions, or unverified projections.</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Top clicked deals</h2>
            <p>When traffic exists, this table identifies the offers with buyer intent.</p>
          </div>
        </div>
        <ProofTable
          empty="No outbound clicks yet."
          rows={topDeals.map((deal) => ({
            name: deal.title,
            detail: deal.merchant,
            clicks: deal.clicks,
            affiliateClicks: deal.affiliate_clicks,
            last: deal.last_click_at
          }))}
        />
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Placement proof</h2>
            <p>Shows which page positions can support affiliate or sponsor pricing.</p>
          </div>
        </div>
        <ProofTable
          empty="No placement clicks yet."
          rows={topPlacements.map((placement) => ({
            name: placement.placement,
            detail: "placement",
            clicks: placement.clicks,
            affiliateClicks: placement.affiliate_clicks,
            last: placement.last_click_at
          }))}
        />
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Campaign proof</h2>
            <p>Use campaign tags for newsletter tests, social drops, partner launches, and outreach.</p>
          </div>
        </div>
        <ProofTable
          empty="No campaign clicks yet."
          rows={topCampaigns.map((campaign) => ({
            name: campaign.campaign,
            detail: "campaign",
            clicks: campaign.clicks,
            affiliateClicks: campaign.affiliate_clicks,
            last: campaign.last_click_at
          }))}
        />
      </section>
    </div>
  );
}

function ProofTable({
  rows,
  empty
}: {
  rows: Array<{ name: string; detail: string; clicks: number; affiliateClicks: number; last: string | null }>;
  empty: string;
}) {
  return (
    <div className="table-panel">
      <div className="admin-table click-table">
        <div className="admin-table-head">Signal</div>
        <div className="admin-table-head">Clicks</div>
        <div className="admin-table-head">Affiliate clicks</div>
        <div className="admin-table-head">Last click</div>
        {rows.length ? (
          rows.map((row) => (
            <div className="admin-table-row" key={`${row.name}-${row.detail}`}>
              <div>
                <strong>{row.name}</strong>
                <span>{row.detail}</span>
              </div>
              <div>{row.clicks}</div>
              <div>{row.affiliateClicks}</div>
              <div>{row.last ? new Date(row.last).toLocaleString("en-US") : "None"}</div>
            </div>
          ))
        ) : (
          <div className="admin-table-row">
            <div>
              <strong>{empty}</strong>
              <span>Tracking is ready; proof grows after distribution starts.</span>
            </div>
            <div>0</div>
            <div>0</div>
            <div>None</div>
          </div>
        )}
      </div>
    </div>
  );
}
