export const metadata = {
  title: "Affiliate Disclosure | Builder Deals Intel",
  description: "How Builder Deals Intel labels affiliate links, sponsorships, and commercial relationships."
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Commercial policy</span>
        <h1>Affiliate disclosure.</h1>
        <p>
          Builder Deals Intel may earn money when readers click or purchase through certain links. Commercial
          relationships do not remove source checks, risk labels, or eligibility notes.
        </p>
      </section>

      <section className="legal-grid">
        <div className="panel">
          <h2>Affiliate links</h2>
          <p className="summary">
            Some deal links may be affiliate links. If a reader signs up or buys through those links, we may receive a
            commission at no extra cost to the reader.
          </p>
        </div>
        <div className="panel">
          <h2>Sponsored placements</h2>
          <p className="summary">
            Sponsored newsletter slots, category features, and launch monitoring placements are labeled separately from
            editorial picks.
          </p>
        </div>
        <div className="panel">
          <h2>Editorial rules</h2>
          <p className="summary">
            We still require a source URL, deal URL, terms, eligibility, region, and risk notes before a commercial
            offer can be published.
          </p>
        </div>
        <div className="panel">
          <h2>Tracking</h2>
          <p className="summary">
            Outbound commercial links may pass through a first-party tracking route so we can measure clicks by page
            placement, affiliate network, and sponsorship campaign.
          </p>
        </div>
        <div className="panel">
          <h2>Rejections</h2>
          <p className="summary">
            We reject hidden terms, unverifiable token offers, misleading lifetime deals, and claims that cannot be
            checked against a primary source.
          </p>
        </div>
      </section>
    </div>
  );
}
