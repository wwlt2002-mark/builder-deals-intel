export const metadata = {
  title: "Sponsor Builder Deals Intel",
  description: "Reach builders looking for AI tools, SaaS discounts, cloud credits, and developer products."
};

export default function SponsorPage() {
  return (
    <div className="page">
      <section className="page-title">
        <h1>Reach builders when they are ready to try, buy, and switch.</h1>
        <p>
          Builder Deals Intel is designed for high-intent discovery across AI tools, SaaS, cloud credits, hosting, and
          developer workflows. Sponsored placements must include clear terms and are labeled separately from editorial
          picks.
        </p>
      </section>
      <section className="deal-grid">
        <div className="panel">
          <h2>Newsletter sponsor</h2>
          <p className="summary">One clearly labeled placement inside the daily Top 10 Deals for Builders brief.</p>
        </div>
        <div className="panel">
          <h2>Category feature</h2>
          <p className="summary">A verified offer on a relevant category page, with source link and eligibility notes.</p>
        </div>
        <div className="panel">
          <h2>Launch monitoring</h2>
          <p className="summary">We track your official promo page and surface qualifying updates when terms change.</p>
        </div>
        <div className="panel">
          <h2>Affiliate partnership</h2>
          <p className="summary">Best fit for SaaS, AI, hosting, cloud, API, and developer products with public terms.</p>
        </div>
      </section>
    </div>
  );
}
