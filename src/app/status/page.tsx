import Link from "next/link";
import { categories } from "@/lib/categories";
import { getClickStats } from "@/lib/clicks";
import { getFeaturedDeals, getReviewDeals } from "@/lib/deals";
import { getMonitoredSources, getSourceHealth } from "@/lib/sources";
import { getSubscriberStats } from "@/lib/storage";

export const metadata = {
  title: "Live Status | Builder Deals Intel",
  description: "Public operating status for Builder Deals Intel deal coverage, sources, clicks, and newsletter growth."
};

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const [featuredDeals, reviewDeals, sources, subscriberStats, clickStats] = await Promise.all([
    getFeaturedDeals(10),
    getReviewDeals(),
    getMonitoredSources(),
    getSubscriberStats(),
    getClickStats()
  ]);
  const sourceHealth = getSourceHealth(sources);
  const latestCheck = sources
    .map((source) => source.last_checked_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  return (
    <div className="page">
      <section className="page-title">
        <span className="eyebrow">Public operating status</span>
        <h1>Deal intelligence, source coverage, and commercial proof.</h1>
        <p>
          This page exposes the signals sponsors and readers care about: source coverage, review volume, outbound click
          tracking, and the current high-confidence brief.
        </p>
      </section>

      <section className="metric-row">
        <div className="metric">
          <strong>{featuredDeals.length}</strong>
          <span>high-confidence live deals</span>
        </div>
        <div className="metric">
          <strong>{reviewDeals.length}</strong>
          <span>items in review</span>
        </div>
        <div className="metric">
          <strong>{sourceHealth.enabled}</strong>
          <span>enabled monitored sources</span>
        </div>
        <div className="metric">
          <strong>{clickStats.total}</strong>
          <span>tracked outbound clicks</span>
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
          <strong>{categories.length}</strong>
          <span>buyer categories</span>
        </div>
        <div className="metric">
          <strong>{sourceHealth.stale}</strong>
          <span>sources stale 24h</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Trust signals</h2>
            <p>Commercial placements are useful only if the editorial system stays transparent.</p>
          </div>
        </div>
        <div className="policy-grid table-panel">
          <div>
            <strong>Disclosure</strong>
            <span>Affiliate and sponsored links are labeled, routed through tracked outbound URLs, and separated from source verification.</span>
          </div>
          <div>
            <strong>Source discipline</strong>
            <span>Official sources can move faster; user submissions and open-web claims remain review-first.</span>
          </div>
          <div>
            <strong>Last source check</strong>
            <span>{latestCheck ? new Date(latestCheck).toLocaleString("en-US") : "No source check recorded yet."}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Current proof set</h2>
            <p>These are the public high-confidence listings used for the newsletter, feeds, and sponsor conversations.</p>
          </div>
          <Link className="secondary-button" href="/sponsor">
            Partner desk
          </Link>
        </div>
        <div className="admin-list">
          {featuredDeals.map((deal, index) => (
            <article className="admin-row admin-row-wide" key={deal.id}>
              <div>
                <div className="deal-meta">
                  <span>#{index + 1}</span>
                  <span>{deal.confidence_score}% confidence</span>
                  <span>{deal.category.replace("_", " ")}</span>
                </div>
                <h3>{deal.title}</h3>
                <p className="summary">{deal.discount_summary}</p>
              </div>
              <div className="admin-actions">
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
