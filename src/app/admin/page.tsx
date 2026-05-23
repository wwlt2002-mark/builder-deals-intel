import Link from "next/link";
import { requireAdminPage } from "@/lib/admin";
import { getAffiliatePipeline } from "@/lib/affiliate-programs";
import { applicationCopy } from "@/lib/application-copy";
import { getCategoryLabel } from "@/lib/categories";
import { getClickStats, getTopClickedDeals, getTopClickPlacements } from "@/lib/clicks";
import { getCompletionAssessment } from "@/lib/completion";
import { getAllDeals, getReviewDeals } from "@/lib/deals";
import { getEnvironmentReadiness } from "@/lib/env-readiness";
import { moneyPages } from "@/lib/money-pages";
import { getRevenueReadiness } from "@/lib/revenue";
import { getMonitoredSources, getSourceHealth } from "@/lib/sources";
import { sponsorOutreach } from "@/lib/sponsor-outreach";
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

export default async function AdminPage({
  searchParams
}: {
  searchParams?: Promise<{ expired?: string; ingested?: string; daily?: string; affiliate?: string }>;
}) {
  await requireAdminPage();
  const params = searchParams ? await searchParams : {};

  const allDeals = await getAllDeals();
  const reviewDeals = await getReviewDeals();
  const submissions = await getSubmissions();
  const sponsorLeads = await getSponsorLeads();
  const sources = await getMonitoredSources();
  const subscriberStats = await getSubscriberStats();
  const subscribers = await getSubscribers(10);
  const clickStats = await getClickStats();
  const topClickedDeals = await getTopClickedDeals();
  const topClickPlacements = await getTopClickPlacements();
  const affiliatePrograms = await getAffiliatePipeline();
  const environmentReadiness = getEnvironmentReadiness();
  const operationalDeals = allDeals.filter((deal) => deal.status !== "rejected");
  const publishedDeals = allDeals.filter((deal) => deal.status === "auto_published");
  const affiliateDeals = operationalDeals.filter((deal) => deal.is_affiliate);
  const queuedSubmissions = submissions.filter((submission) => submission.status === "queued");
  const newSponsorLeads = sponsorLeads.filter((lead) => lead.status === "new");
  const revenueReadiness = getRevenueReadiness(allDeals, affiliatePrograms);
  const sourceHealth = getSourceHealth(sources);
  const completion = getCompletionAssessment({
    deals: allDeals,
    subscribers,
    sponsorLeads,
    affiliatePrograms,
    enabledSources: sourceHealth.enabled,
    moneyPages: moneyPages.length,
    aiExtractionReady: true,
    environmentDashboardReady: true,
    commercialOutreachReady: true,
    distributionFeedsReady: true,
    publicStatusReady: true
  });

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
        {params.expired ? <p className="summary">Expiry check complete. {params.expired} deals were marked expired.</p> : null}
        {params.ingested ? <p className="summary">Source ingest complete. {params.ingested} candidates were checked.</p> : null}
        {params.daily ? <p className="summary">Daily ops complete. {params.daily} source candidates were checked.</p> : null}
        {params.affiliate ? <p className="summary">Affiliate pipeline status updated.</p> : null}
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
        <div className="metric">
          <strong>{sourceHealth.enabled}</strong>
          <span>enabled sources</span>
        </div>
        <div className="metric">
          <strong>{sourceHealth.stale}</strong>
          <span>sources stale 24h</span>
        </div>
      </div>

      <section>
        <div className="section-head">
          <div>
            <h2>Completion meter</h2>
            <p>Current distance to a polished, revenue-capable operating system.</p>
          </div>
        </div>
        <div className="table-panel completion-panel">
          <div className="completion-score">
            <strong>{completion.percent}%</strong>
            <span>{completion.reason}</span>
          </div>
          <div className="completion-bar" aria-label={`${completion.percent}% complete`}>
            <span style={{ width: `${completion.percent}%` }} />
          </div>
          <div className="policy-grid">
            <div>
              <strong>Working</strong>
              <span>{completion.strengths.join(" ")}</span>
            </div>
            <div>
              <strong>Still missing</strong>
              <span>{completion.gaps.join(" ")}</span>
            </div>
            <div>
              <strong>Next lift</strong>
              <span>Affiliate approvals, Resend key, real subscribers, and production AI extraction move this past 80%.</span>
            </div>
          </div>
        </div>
      </section>

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
        <div className="table-panel owner-blocker-panel">
          <div className="admin-table owner-blocker-table">
            <div className="admin-table-head">Owner intervention queue</div>
            <div className="admin-table-head">Why it matters</div>
            {revenueReadiness.ownerInterventions.map((item) => (
              <div className="admin-table-row" key={item}>
                <div>
                  <strong>{item.split(": ")[0]}</strong>
                  <span>{item.split(": ").slice(1).join(": ")}</span>
                </div>
                <div>Needed only when the affiliate platform asks for payout, tax, identity, or account verification.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Environment readiness</h2>
            <p>Shows what is configured without exposing secrets.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table env-table">
            <div className="admin-table-head">Service</div>
            <div className="admin-table-head">Status</div>
            <div className="admin-table-head">Required for</div>
            <div className="admin-table-head">Owner action</div>
            {environmentReadiness.map((item) => (
              <div className="admin-table-row" key={item.key}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.key}</span>
                </div>
                <div>
                  <span className={item.status === "configured" ? "status-published" : "status-review"}>
                    {item.status}
                  </span>
                </div>
                <div>{item.requiredFor}</div>
                <div>{item.ownerAction}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Maintenance</h2>
            <p>Run low-risk housekeeping jobs before publishing or sending briefs.</p>
          </div>
        </div>
        <div className="admin-list">
          <article className="admin-row admin-row-wide">
            <div>
              <h3>Expire past-due deals</h3>
              <p className="summary">Marks any published, draft, or review deal as expired when its expiration date has passed.</p>
            </div>
            <div className="admin-actions">
              <form action="/api/admin/maintenance/expire-deals" method="post">
                <button className="button" type="submit">
                  Run expiry check
                </button>
              </form>
            </div>
          </article>
          <article className="admin-row admin-row-wide">
            <div>
              <h3>Ingest monitored sources</h3>
              <p className="summary">Syncs the source catalog, updates last-checked timestamps, and creates review candidates.</p>
            </div>
            <div className="admin-actions">
              <form action="/api/admin/maintenance/ingest-sources" method="post">
                <button className="button" type="submit">
                  Run source ingest
                </button>
              </form>
            </div>
          </article>
          <article className="admin-row admin-row-wide">
            <div>
              <h3>Run daily operating loop</h3>
              <p className="summary">Expires past-due deals, ingests monitored sources, and refreshes the admin readiness snapshot.</p>
            </div>
            <div className="admin-actions">
              <form action="/api/admin/maintenance/daily-ops" method="post">
                <button className="button" type="submit">
                  Run daily ops
                </button>
              </form>
            </div>
          </article>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Source monitor</h2>
            <p>Track whether the crawler is checking official and community sources often enough.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table source-table">
            <div className="admin-table-head">Source</div>
            <div className="admin-table-head">Category</div>
            <div className="admin-table-head">Type</div>
            <div className="admin-table-head">Threshold</div>
            <div className="admin-table-head">Last checked</div>
            {sources.map((source) => (
              <div className="admin-table-row" key={source.url}>
                <div>
                  <strong>{source.name}</strong>
                  <span>{source.url}</span>
                </div>
                <div>{getCategoryLabel(source.category)}</div>
                <div>{source.source_type.replace("_", " ")}</div>
                <div>{source.auto_publish_threshold}%</div>
                <div>{source.last_checked_at ? new Date(source.last_checked_at).toLocaleString("en-US") : "Never"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Application copy bank</h2>
            <p>Reusable answers for affiliate program forms. Keep traffic claims conservative until data exists.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table application-copy-table">
            <div className="admin-table-head">Field</div>
            <div className="admin-table-head">Answer</div>
            {applicationCopy.map((item) => (
              <div className="admin-table-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <span>Ready for application forms</span>
                </div>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Sponsor outreach kit</h2>
            <p>Ready-to-send pitches for finding the first paid tests without waiting for organic traffic.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table outreach-table">
            <div className="admin-table-head">Segment</div>
            <div className="admin-table-head">Subject</div>
            <div className="admin-table-head">Pitch</div>
            <div className="admin-table-head">Ask</div>
            {sponsorOutreach.map((item) => (
              <div className="admin-table-row" key={item.segment}>
                <div>
                  <strong>{item.segment}</strong>
                  <span>{item.target}</span>
                </div>
                <div>{item.subject}</div>
                <div>{item.pitch}</div>
                <div>{item.ask}</div>
              </div>
            ))}
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
                  {submission.generated_deal_id ? (
                    <Link className="secondary-button" href={`/admin/deals/${submission.generated_deal_id}`}>
                      Draft
                    </Link>
                  ) : (
                    <form action={`/api/admin/submissions/${submission.id}/extract`} method="post">
                      <button className="button" type="submit">
                        AI draft
                      </button>
                    </form>
                  )}
                  <form action={`/api/admin/submissions/${submission.id}`} method="post">
                    <input name="status" type="hidden" value="reviewed" />
                    <button className="secondary-button" type="submit">
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
            <div className="admin-table-head">Tracking</div>
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
                  <form action={`/api/admin/affiliate-programs/${program.id}`} className="affiliate-status-form" method="post">
                    <a className="secondary-button" href={program.url} rel="noopener noreferrer" target="_blank">
                      Open
                    </a>
                    <label htmlFor={`pipeline_status_${program.id}`}>Status</label>
                    <select
                      id={`pipeline_status_${program.id}`}
                      name="pipeline_status"
                      defaultValue={program.pipeline_status}
                    >
                      <option value="planned">Planned</option>
                      <option value="applied">Applied</option>
                      <option value="approved">Approved</option>
                      <option value="blocked">Blocked</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <label htmlFor={`approved_url_${program.id}`}>Approved URL</label>
                    <input
                      id={`approved_url_${program.id}`}
                      name="approved_url"
                      placeholder="Affiliate link after approval"
                      type="url"
                      defaultValue={program.approved_url ?? ""}
                    />
                    <label htmlFor={`notes_${program.id}`}>Notes</label>
                    <textarea
                      id={`notes_${program.id}`}
                      name="notes"
                      placeholder="Payout, login, rejection, or owner blocker"
                      defaultValue={program.notes ?? ""}
                    />
                    {program.updated_at ? <span>Updated {new Date(program.updated_at).toLocaleString("en-US")}</span> : null}
                    <button className="button" type="submit">
                      Save
                    </button>
                  </form>
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
