import Link from "next/link";
import { requireAdminPage } from "@/lib/admin";
import { affiliatePrograms } from "@/lib/affiliate-programs";
import { getCategoryLabel } from "@/lib/categories";
import { getAllDeals, getReviewDeals } from "@/lib/deals";
import { getSubmissions } from "@/lib/storage";
import type { DealStatus } from "@/lib/types";

export const metadata = {
  title: "Admin Review Queue | Builder Deals Intel"
};

export const dynamic = "force-dynamic";

const statusLabels: Record<DealStatus, string> = {
  draft: "Draft",
  auto_published: "Published",
  needs_review: "Review",
  rejected: "Rejected",
  expired: "Expired"
};

export default async function AdminPage() {
  await requireAdminPage();

  const allDeals = await getAllDeals();
  const reviewDeals = await getReviewDeals();
  const submissions = await getSubmissions();
  const publishedDeals = allDeals.filter((deal) => deal.status === "auto_published");
  const affiliateDeals = allDeals.filter((deal) => deal.is_affiliate);
  const queuedSubmissions = submissions.filter((submission) => submission.status === "queued");

  return (
    <div className="page">
      <section className="page-title">
        <h1>Operations desk.</h1>
        <p>Review risky listings, attach affiliate URLs, and keep the daily deal feed clean enough to trust.</p>
        <div className="hero-actions">
          <Link className="button" href="/admin/deals/new">
            Add deal
          </Link>
        </div>
      </section>
      <div className="metric-row">
        <div className="metric">
          <strong>{publishedDeals.length}</strong>
          <span>published deals</span>
        </div>
        <div className="metric">
          <strong>{reviewDeals.length}</strong>
          <span>waiting for review</span>
        </div>
        <div className="metric">
          <strong>{affiliateDeals.length}</strong>
          <span>affiliate-enabled deals</span>
        </div>
        <div className="metric">
          <strong>{queuedSubmissions.length}</strong>
          <span>queued submissions</span>
        </div>
      </div>

      <section>
        <div className="section-head">
          <div>
            <h2>Needs review</h2>
            <p>Publish only when source, price, region, and restrictions are clear.</p>
          </div>
        </div>
        <div className="admin-list">
          {reviewDeals.length ? (
            reviewDeals.map((deal) => (
              <article className="admin-row admin-row-wide" key={deal.id}>
                <div>
                  <div className="deal-meta">
                    <span>{getCategoryLabel(deal.category)}</span>
                    <span>{deal.source_type.replace("_", " ")}</span>
                    <span className="status-review">{deal.confidence_score}% confidence</span>
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
                  <Link className="secondary-button" href={`/admin/deals/${deal.id}`}>
                    Edit
                  </Link>
                  <form action={`/api/admin/deals/${deal.id}`} method="post">
                    <input name="action" type="hidden" value="status" />
                    <input name="status" type="hidden" value="auto_published" />
                    <button className="button" type="submit">
                      Publish
                    </button>
                  </form>
                  <form action={`/api/admin/deals/${deal.id}`} method="post">
                    <input name="action" type="hidden" value="status" />
                    <input name="status" type="hidden" value="rejected" />
                    <button className="secondary-button" type="submit">
                      Reject
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <div className="panel">
              <p className="summary">No deals are waiting for review.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>All tracked deals</h2>
            <p>Keep affiliate status, expiration, and confidence aligned with reality.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table">
            <div className="admin-table-head">Deal</div>
            <div className="admin-table-head">Category</div>
            <div className="admin-table-head">Status</div>
            <div className="admin-table-head">Affiliate</div>
            <div className="admin-table-head">Action</div>
            {allDeals.map((deal) => (
              <div className="admin-table-row" key={deal.id}>
                <div>
                  <strong>{deal.title}</strong>
                  <span>{deal.merchant}</span>
                </div>
                <div>{getCategoryLabel(deal.category)}</div>
                <div>{statusLabels[deal.status]}</div>
                <div>{deal.affiliate_status}</div>
                <div>
                  <Link className="secondary-button" href={`/admin/deals/${deal.id}`}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>User submissions</h2>
            <p>Submissions stay queued until converted into a verified deal or dismissed.</p>
          </div>
        </div>
        <div className="admin-list">
          {submissions.length ? (
            submissions.map((submission) => (
              <article className="admin-row admin-row-wide" key={submission.id}>
                <div>
                  <div className="deal-meta">
                    <span>{submission.status}</span>
                    <span>{submission.relationship}</span>
                    <span>{new Date(submission.created_at).toLocaleString("en-US")}</span>
                  </div>
                  <h3>
                    <a href={submission.submitted_url} rel="noopener noreferrer" target="_blank">
                      {submission.submitted_url}
                    </a>
                  </h3>
                  <p className="summary">{submission.submitter_note ?? "No submitter note."}</p>
                  {submission.submitter_email ? <p className="summary">{submission.submitter_email}</p> : null}
                </div>
                <div className="admin-actions">
                  <form action={`/api/admin/submissions/${submission.id}`} method="post">
                    <input name="status" type="hidden" value="reviewed" />
                    <button className="button" type="submit">
                      Reviewed
                    </button>
                  </form>
                  <form action={`/api/admin/submissions/${submission.id}`} method="post">
                    <input name="status" type="hidden" value="spam" />
                    <button className="secondary-button" type="submit">
                      Spam
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <div className="panel">
              <p className="summary">No submissions yet.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Affiliate pipeline</h2>
            <p>Apply only where the product fits builder intent and has trackable payouts.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table affiliate-table">
            <div className="admin-table-head">Program</div>
            <div className="admin-table-head">Category</div>
            <div className="admin-table-head">Network</div>
            <div className="admin-table-head">Priority</div>
            <div className="admin-table-head">Action</div>
            {affiliatePrograms.map((program) => (
              <div className="admin-table-row" key={program.name}>
                <div>
                  <strong>{program.name}</strong>
                  <span>{program.fit}</span>
                </div>
                <div>{getCategoryLabel(program.category)}</div>
                <div>{program.network}</div>
                <div>{program.priority}</div>
                <div>
                  <a className="secondary-button" href={program.url} rel="noopener noreferrer" target="_blank">
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
