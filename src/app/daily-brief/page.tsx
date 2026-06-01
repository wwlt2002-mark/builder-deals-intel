import Link from "next/link";
import { getCategoryLabel } from "@/lib/categories";
import { getFeaturedDeals, getReviewDeals } from "@/lib/deals";
import type { DealCategory } from "@/lib/types";

export const metadata = {
  title: "Daily Builder Deals Brief | Builder Deals Intel",
  description:
    "A daily source-backed brief of AI, SaaS, hosting, cloud credit, and developer tool deals for builders."
};

export const dynamic = "force-dynamic";

export default async function DailyBriefPage() {
  const [deals, reviewDeals] = await Promise.all([getFeaturedDeals(10), getReviewDeals()]);
  const publishedAt = new Date();
  const categoryCounts = deals.reduce<Record<string, number>>((counts, deal) => {
    counts[deal.category] = (counts[deal.category] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <div className="page">
      <section className="page-title">
        <span className="eyebrow">Daily builder deals brief</span>
        <h1>Today&apos;s source-backed tech deals.</h1>
        <p>
          A compact operating brief for builders comparing AI tools, SaaS, hosting, cloud credits, and developer
          infrastructure. Every item keeps its source link, risk labels, and outbound tracking path.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/newsletter">
            Get future briefs
          </Link>
          <Link className="secondary-button" href="/commercial-proof">
            View commercial proof
          </Link>
        </div>
      </section>

      <section className="metric-row">
        <div className="metric">
          <strong>{deals.length}</strong>
          <span>brief items</span>
        </div>
        <div className="metric">
          <strong>{reviewDeals.length}</strong>
          <span>review queue</span>
        </div>
        <div className="metric">
          <strong>{Object.keys(categoryCounts).length}</strong>
          <span>categories covered</span>
        </div>
        <div className="metric">
          <strong>{publishedAt.toLocaleDateString("en-US")}</strong>
          <span>published date</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Brief summary</h2>
            <p>Useful for readers, sponsor review, and affiliate application proof.</p>
          </div>
        </div>
        <div className="policy-grid table-panel">
          <div>
            <strong>Best fit today</strong>
            <span>{deals[0]?.title ?? "No high-confidence deal is currently published."}</span>
          </div>
          <div>
            <strong>Category mix</strong>
            <span>
              {Object.entries(categoryCounts)
                .map(([category, count]) => `${getCategoryLabel(category as DealCategory)}: ${count}`)
                .join("; ") || "No category coverage yet."}
            </span>
          </div>
          <div>
            <strong>Editorial rule</strong>
            <span>Unverified community claims, token-like offers, and unclear price changes stay out of the brief.</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Top verified deals</h2>
            <p>Ranked by confidence score and source quality.</p>
          </div>
        </div>
        <div className="admin-list">
          {deals.map((deal, index) => (
            <article className="admin-row admin-row-wide" key={deal.id}>
              <div>
                <div className="deal-meta">
                  <span>#{index + 1}</span>
                  <span>{getCategoryLabel(deal.category)}</span>
                  <span>{deal.confidence_score}% confidence</span>
                  <span>{deal.region}</span>
                </div>
                <h3>{deal.title}</h3>
                <p className="summary">{deal.ai_summary}</p>
                <div className="tag-row">
                  {deal.risk_tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="admin-actions">
                <a
                  className="button"
                  href={`/out/${deal.slug}?placement=daily_brief`}
                  rel="nofollow sponsored noopener noreferrer"
                  target="_blank"
                >
                  Open deal
                </a>
                <Link className="secondary-button" href={`/deals/${deal.slug}`}>
                  Inspect
                </Link>
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
