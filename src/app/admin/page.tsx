import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllDeals, getReviewDeals } from "@/lib/deals";

export const metadata = {
  title: "Admin Review Queue | Builder Deals Intel"
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminSecret = process.env.ADMIN_SECRET;
  const session = (await cookies()).get("admin_session")?.value;

  if (adminSecret && session !== adminSecret) {
    redirect("/admin/login");
  }

  const allDeals = await getAllDeals();
  const reviewDeals = await getReviewDeals();

  return (
    <div className="page">
      <section className="page-title">
        <h1>Review queue.</h1>
        <p>
          Low-confidence, user-submitted, community-sourced, price-anomaly, and sensitive listings stay here until a
          human verifies them.
        </p>
      </section>
      <div className="metric-row">
        <div className="metric">
          <strong>{allDeals.length}</strong>
          <span>total tracked deals</span>
        </div>
        <div className="metric">
          <strong>{reviewDeals.length}</strong>
          <span>waiting for review</span>
        </div>
        <div className="metric">
          <strong>85</strong>
          <span>official auto-publish threshold</span>
        </div>
      </div>

      <section>
        <div className="section-head">
          <div>
            <h2>Needs review</h2>
            <p>These items should not go into the daily email until verified.</p>
          </div>
        </div>
        <div className="admin-list">
          {reviewDeals.map((deal) => (
            <article className="admin-row" key={deal.id}>
              <div>
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
              <span className="status-review">{deal.confidence_score}%</span>
              <Link className="secondary-button" href={`/deals/${deal.slug}`}>
                Inspect
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
