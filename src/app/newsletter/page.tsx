import { getFeaturedDeals } from "@/lib/deals";

export const metadata = {
  title: "Daily Newsletter | Builder Deals Intel",
  description: "Get the top 10 AI, SaaS, cloud, and developer deals every morning."
};

export default async function NewsletterPage({
  searchParams
}: {
  searchParams?: Promise<{ subscribed?: string }>;
}) {
  const deals = await getFeaturedDeals(10);

  return (
    <div className="page">
      <section className="page-title">
        <h1>Top 10 Deals for Builders.</h1>
        <p>
          A concise daily brief for AI tools, SaaS discounts, developer perks, cloud credits, and hosting offers. No
          generic coupon clutter.
        </p>
      </section>
      <form action="/api/newsletter" className="panel form-grid" method="post">
        {searchParams ? <NewsletterNotice searchParams={searchParams} /> : null}
        <div aria-hidden="true" className="hp-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" tabIndex={-1} type="text" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="you@example.com" type="email" required />
        </div>
        <button className="button" type="submit">
          Join the daily brief
        </button>
      </form>
      <section className="newsletter-sponsor-band">
        <div>
          <span className="eyebrow">Sponsor slot</span>
          <h2>Daily brief sponsorship is reserved for verified builder tools.</h2>
          <p className="summary">One labeled slot, source-backed terms, no hidden placement.</p>
        </div>
        <a className="secondary-button" href="/sponsor">
          Partner desk
        </a>
      </section>
      <section>
        <div className="section-head">
          <div>
            <h2>Current brief preview</h2>
            <p>High-confidence items only.</p>
          </div>
          <a className="secondary-button" href="/newsletter/archive">
            View archive
          </a>
        </div>
        <div className="admin-list">
          {deals.map((deal, index) => (
            <article className="admin-row" key={deal.id}>
              <div>
                <h3>
                  {index + 1}. {deal.title}
                </h3>
                <p className="summary">{deal.discount_summary}</p>
              </div>
              <span className="status-published">{deal.confidence_score}%</span>
              <div className="admin-actions">
                <a
                  className="button"
                  href={`/out/${deal.slug}?placement=newsletter_preview`}
                  rel="nofollow sponsored noopener noreferrer"
                  target="_blank"
                >
                  Open deal
                </a>
                <a className="secondary-button" href={deal.source_url} rel="noopener noreferrer" target="_blank">
                  Source
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

async function NewsletterNotice({ searchParams }: { searchParams: Promise<{ subscribed?: string }> }) {
  const params = await searchParams;

  if (params.subscribed !== "1") {
    return null;
  }

  return <p className="summary">You are on the list. The first brief will focus on high-confidence builder deals.</p>;
}
