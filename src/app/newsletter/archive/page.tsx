import Link from "next/link";
import { getFeaturedDeals } from "@/lib/deals";

export const metadata = {
  title: "Newsletter Archive | Builder Deals Intel",
  description: "Preview the latest Top 10 Deals for Builders brief.",
  alternates: {
    canonical: "/newsletter/archive"
  },
  openGraph: {
    title: "Newsletter Archive | Builder Deals Intel",
    description: "Preview the latest source-backed Top 10 Deals for Builders brief.",
    url: "/newsletter/archive",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Newsletter Archive | Builder Deals Intel",
    description: "Preview the latest source-backed Top 10 Deals for Builders brief."
  }
};

export const dynamic = "force-dynamic";

export default async function NewsletterArchivePage() {
  const deals = await getFeaturedDeals(10);

  return (
    <div className="page">
      <section className="page-title">
        <span className="eyebrow">Latest brief</span>
        <h1>Top 10 Deals for Builders.</h1>
        <p>
          A public preview of the current daily deal brief. Newsletter sponsorships appear only when clearly labeled and
          source-backed.
        </p>
      </section>

      <section className="brief-panel">
        <div className="console-topline light-topline">
          <span>{new Date().toLocaleDateString("en-US")}</span>
          <strong>{deals.length} verified</strong>
        </div>
        <div className="admin-list">
          {deals.map((deal, index) => (
            <article className="admin-row admin-row-wide" key={deal.id}>
              <div>
                <div className="deal-meta">
                  <span>#{index + 1}</span>
                  <span>{deal.confidence_score}% confidence</span>
                  <span>{deal.region}</span>
                </div>
                <h3>{deal.title}</h3>
                <p className="summary">{deal.ai_summary}</p>
              </div>
              <div className="admin-actions">
                <a
                  className="button"
                  href={`/out/${deal.slug}?placement=newsletter_archive`}
                  rel="nofollow sponsored noopener noreferrer"
                  target="_blank"
                >
                  Open deal
                </a>
                <Link className="secondary-button" href={`/deals/${deal.slug}`}>
                  Inspect
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
