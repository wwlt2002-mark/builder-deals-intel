import Link from "next/link";
import { requireAdminPage } from "@/lib/admin";
import { affiliatePrograms } from "@/lib/affiliate-programs";
import { getCategoryLabel } from "@/lib/categories";
import { getClickStats, getTopClickedDeals, getTopClickPlacements } from "@/lib/clicks";
import { getAllDeals, getReviewDeals } from "@/lib/deals";
import { getRevenueReadiness } from "@/lib/revenue";
import { getSponsorLeads, getSubscriberStats, getSubscribers, getSubmissions } from "@/lib/storage";
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
  const sponsorLeads = await getSponsorLeads();
  const subscriberStats = await getSubscriberStats();
  const subscribers = await getSubscribers(10);
  const clickStats = await getClickStats();
  const topClickedDeals = await getTopClickedDeals();
  const topClickPlacements = await getTopClickPlacements();
  const operationalDeals = allDeals.filter((deal) => deal.status !== "rejected");
  const publishedDeals = allDeals.filter((deal) => deal.status === "auto_published");
  const affiliateDeals = operationalDeals.filter((deal) => deal.is_affiliate);
  const queuedSubmissions = submissions.filter((submission) => submission.status === "queued");
  const newSponsorLeads = sponsorLeads.filter((lead) => lead.status === "new");
  const revenueReadiness = getRevenueReadiness(allDeals, affiliatePrograms);

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
        <div className="metric">
          <strong>{clickStats.total}</strong>
          <span>outbound clicks tracked</span>
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
          <strong>{newSponsorLeads.length}</strong>
          <span>new sponsor leads</span>
        </div>
        <div className="metric">
          <strong>{subscriberStats.total}</strong>
          <span>newsletter subscribers</span>
        </div>
        <div className="metric">
          <strong>{subscriberStats.last7d}</strong>
          <span>subscribers in 7d</span>
        </div>
      </div>

      <section>
        <div className="section-head">
          <div>
            <h2>Revenue readiness</h2>
            <p>Turn traffic into tracked affiliate clicks, sponsor leads, and payout-ready applications.</p>
          </div>
        </div>
        <div className="metric-row">
          <div className="metric">
            <strong>{revenueReadiness.affiliateReadyDeals}</strong>
            <span>affiliate links live</span>
          </div>
          <div className="metric">
            <strong>{revenueReadiness.applicationReadyPrograms}</strong>
            <span>programs ready to apply</span>
          </div>
          <div className="metric">
            <strong>{revenueReadiness.missingAffiliateUrls}</strong>
            <span>approved links missing URLs</span>
          </div>
          <div className="metric">
            <strong>{revenueReadiness.sponsoredInventory.length}</strong>
            <span>sponsor inventory types</span>
          </div>
        </div>
        <div className="table-panel revenue-panel">
          <div className="policy-grid">
            <div>
              <strong>Sell first</strong>
              <span>{revenueReadiness.sponsoredInventory.join(", ")}</span>
            </div>
            <div>
              <strong>Payout setup needed</strong>
              <span>{revenueReadiness.payoutSetupNeeded.join("; ") || "No payout blockers detected."}</span>
            </div>
            <div>
              <strong>Next moves</strong>
              <span>{revenueReadiness.nextMoves.join(" ")}</span>
            </div>
          </div>
        </div>
      </section>

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
            <p>Keep active operational listings aligned with source, affiliate, expiration, and confidence reality.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table">
            <div className="admin-table-head">Deal</div>
            <div className="admin-table-head">Category</div>
            <div className="admin-table-head">Status</div>
            <div className="admin-table-head">Affiliate</div>
            <div className="admin-table-head">Action</div>
            {operationalDeals.map((deal) => (
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
            <h2>Click intelligence</h2>
            <p>Outbound clicks show which offers have monetization gravity.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table click-table">
            <div className="admin-table-head">Deal</div>
            <div className="admin-table-head">Merchant</div>
            <div className="admin-table-head">Clicks</div>
            <div className="admin-table-head">Affiliate</div>
            <div className="admin-table-head">Last click</div>
            {topClickedDeals.length ? (
              topClickedDeals.map((deal) => (
                <div className="admin-table-row" key={deal.slug}>
                  <div>
                    <strong>{deal.title}</strong>
                    <span>{deal.slug}</span>
                  </div>
                  <div>{deal.merchant}</div>
                  <div>{deal.clicks}</div>
                  <div>{deal.affiliate_clicks}</div>
                  <div>{deal.last_click_at ? new Date(deal.last_click_at).toLocaleString("en-US") : "None"}</div>
                </div>
              ))
            ) : (
              <div className="admin-table-row">
                <div>
                  <strong>No outbound clicks yet</strong>
                  <span>Click data appears after users open deal links.</span>
                </div>
                <div />
                <div />
                <div />
                <div />
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Placement attribution</h2>
            <p>Track which page positions produce affiliate and sponsor value.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table placement-table">
            <div className="admin-table-head">Placement</div>
            <div className="admin-table-head">Clicks</div>
            <div className="admin-table-head">Affiliate</div>
            <div className="admin-table-head">Last click</div>
            {topClickPlacements.length ? (
              topClickPlacements.map((placement) => (
                <div className="admin-table-row" key={placement.placement}>
                  <div>
                    <strong>{placement.placement}</strong>
                    <span>Outbound route attribution</span>
                  </div>
                  <div>{placement.clicks}</div>
                  <div>{placement.affiliate_clicks}</div>
                  <div>{placement.last_click_at ? new Date(placement.last_click_at).toLocaleString("en-US") : "None"}</div>
                </div>
              ))
            ) : (
              <div className="admin-table-row">
                <div>
                  <strong>No placement clicks yet</strong>
                  <span>Attribution appears after users open tracked deal links.</span>
                </div>
                <div />
                <div />
                <div />
              </div>
            )}
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
            <div className="admin-table-head">Commission</div>
            <div className="admin-table-head">Application</div>
            <div className="admin-table-head">Action</div>
            {affiliatePrograms.map((program) => (
              <div className="admin-table-row" key={program.name}>
                <div>
                  <strong>{program.name}</strong>
                  <span>{program.fit}</span>
                  <span>Asset: {program.launch_asset}</span>
                </div>
                <div>{getCategoryLabel(program.category)}</div>
                <div>{program.network}</div>
                <div>{program.commission}</div>
                <div>
                  <strong>{program.application_stage.replace("_", " ")}</strong>
                  <span>{program.owner_blocker}</span>
                  <span>{program.next_step}</span>
                </div>
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

      <section>
        <div className="section-head">
          <div>
            <h2>Sponsor leads</h2>
            <p>Partner requests captured from the public sponsor page.</p>
          </div>
        </div>
        <div className="admin-list">
          {sponsorLeads.length ? (
            sponsorLeads.map((lead) => (
              <article className="admin-row admin-row-wide" key={lead.id}>
                <div>
                  <div className="deal-meta">
                    <span>{lead.status}</span>
                    <span>{lead.offer_type}</span>
                    <span>{new Date(lead.created_at).toLocaleString("en-US")}</span>
                  </div>
                  <h3>{lead.company}</h3>
                  <p className="summary">
                    {lead.email}
                    {lead.website ? ` · ${lead.website}` : ""}
                    {lead.budget ? ` · ${lead.budget}` : ""}
                  </p>
                  <p className="summary">{lead.message ?? "No message."}</p>
                </div>
                <div className="admin-actions">
                  <form action={`/api/admin/sponsor-leads/${lead.id}`} method="post">
                    <input name="status" type="hidden" value="contacted" />
                    <button className="button" type="submit">
                      Contacted
                    </button>
                  </form>
                  <form action={`/api/admin/sponsor-leads/${lead.id}`} method="post">
                    <input name="status" type="hidden" value="qualified" />
                    <button className="secondary-button" type="submit">
                      Qualified
                    </button>
                  </form>
                  <form action={`/api/admin/sponsor-leads/${lead.id}`} method="post">
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
              <p className="summary">No sponsor leads yet.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Newsletter subscribers</h2>
            <p>Recent subscribers and unsubscribe-token readiness.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table subscriber-table">
            <div className="admin-table-head">Email</div>
            <div className="admin-table-head">Source</div>
            <div className="admin-table-head">Status</div>
            <div className="admin-table-head">Joined</div>
            {subscribers.length ? (
              subscribers.map((subscriber) => (
                <div className="admin-table-row" key={subscriber.id}>
                  <div>
                    <strong>{subscriber.email}</strong>
                    <span>{subscriber.unsubscribe_token ? "unsubscribe ready" : "token pending"}</span>
                  </div>
                  <div>{subscriber.source}</div>
                  <div>{subscriber.status}</div>
                  <div>{new Date(subscriber.created_at).toLocaleString("en-US")}</div>
                </div>
              ))
            ) : (
              <div className="admin-table-row">
                <div>
                  <strong>No subscribers yet</strong>
                  <span>Newsletter signups will appear here.</span>
                </div>
                <div />
                <div />
                <div />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
