export const metadata = {
  title: "Sponsor Builder Deals Intel",
  description: "Reach builders looking for AI tools, SaaS discounts, cloud credits, and developer products."
};

export default function SponsorPage({
  searchParams
}: {
  searchParams?: Promise<{ submitted?: string }>;
}) {
  return (
    <div className="page">
      <section className="hero media-hero">
        <div className="hero-copy">
          <span className="eyebrow">Partner desk</span>
          <h1>Reach builders when they are ready to try, buy, and switch.</h1>
          <p>
            Builder Deals Intel is a source-labeled deal intelligence site for AI tools, SaaS, cloud credits, hosting,
            and developer workflows. Sponsored placements must include clear terms and stay separate from editorial
            picks.
          </p>
        </div>
        <aside className="signal-console media-kit">
          <div className="console-topline">
            <span>Media Kit</span>
            <strong>OPEN</strong>
          </div>
          <div className="metric-row signal-metrics">
            <div className="metric">
              <strong>AI</strong>
              <span>tool buyers</span>
            </div>
            <div className="metric">
              <strong>SaaS</strong>
              <span>trial intent</span>
            </div>
            <div className="metric">
              <strong>Dev</strong>
              <span>cloud spend</span>
            </div>
          </div>
          <p>
            Early packages are priced manually while traffic is building. We only need a verified offer, source page,
            terms, and tracking URL.
          </p>
        </aside>
      </section>

      <section className="deal-grid">
        <div className="panel sponsor-card">
          <h2>Newsletter sponsor</h2>
          <strong>$150-$500 test package</strong>
          <p className="summary">One clearly labeled placement inside the daily Top 10 Deals for Builders brief.</p>
        </div>
        <div className="panel sponsor-card">
          <h2>Category feature</h2>
          <strong>$250-$750 test package</strong>
          <p className="summary">A verified offer on a relevant category page, with source link and eligibility notes.</p>
        </div>
        <div className="panel sponsor-card">
          <h2>Launch monitoring</h2>
          <strong>$300-$1,000 per promo window</strong>
          <p className="summary">We track your official promo page and surface qualifying updates when terms change.</p>
        </div>
        <div className="panel sponsor-card">
          <h2>Affiliate partnership</h2>
          <strong>CPA or revenue share</strong>
          <p className="summary">Best fit for SaaS, AI, hosting, cloud, API, and developer products with public terms.</p>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Commercial policy</h2>
            <p>Trust is the product. Sponsorships cannot bypass source checks or risk labels.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="policy-grid">
            <div>
              <strong>Required</strong>
              <span>Official source URL, deal URL, eligibility, region, price, expiration or promo window.</span>
            </div>
            <div>
              <strong>Allowed</strong>
              <span>Affiliate links, sponsored newsletter slots, category placements, launch monitoring.</span>
            </div>
            <div>
              <strong>Rejected</strong>
              <span>Hidden terms, unverifiable token offers, misleading lifetime deals, copied competitor claims.</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Start a partnership</h2>
            <p>Send the offer details needed for review. We will not publish hidden or unverifiable terms.</p>
          </div>
        </div>
        <form action="/api/sponsor" className="panel form-grid admin-edit-form" method="post">
          {searchParams ? <SponsorNotice searchParams={searchParams} /> : null}
          <div className="form-columns">
            <div className="field">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" required type="text" />
            </div>
            <div className="field">
              <label htmlFor="contact_name">Contact name</label>
              <input id="contact_name" name="contact_name" type="text" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" required type="email" />
            </div>
            <div className="field">
              <label htmlFor="website">Website or offer URL</label>
              <input id="website" name="website" type="url" />
            </div>
            <div className="field">
              <label htmlFor="offer_type">Partnership type</label>
              <select id="offer_type" name="offer_type" defaultValue="affiliate">
                <option value="affiliate">Affiliate partnership</option>
                <option value="newsletter">Newsletter sponsor</option>
                <option value="category">Category feature</option>
                <option value="monitoring">Launch monitoring</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="budget">Budget or CPA terms</label>
              <input id="budget" name="budget" type="text" placeholder="$500 test, 30% rev share, $80 CPA" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">Offer details</label>
            <textarea
              id="message"
              name="message"
              placeholder="Product, promo terms, eligibility, region, expiry date, tracking link, and anything users should know."
            />
          </div>
          <button className="button" type="submit">
            Send partnership request
          </button>
        </form>
      </section>
    </div>
  );
}

async function SponsorNotice({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const params = await searchParams;

  if (params.submitted !== "1") {
    return null;
  }

  return <p className="summary">Partnership request received. It is queued for commercial review.</p>;
}
