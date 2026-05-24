import Link from "next/link";
import { applicationCopy } from "@/lib/application-copy";
import { affiliatePrograms } from "@/lib/affiliate-programs";

export const metadata = {
  title: "Affiliate Partner Program Kit | Builder Deals Intel",
  description: "Affiliate program application profile, promotion methods, compliance rules, and content assets."
};

const priorityAssets = [
  { href: "/hosting-for-saas-projects", label: "Best Hosting Deals for New SaaS Projects" },
  { href: "/newsletter-tools-for-builders", label: "Best Newsletter Tools for Builders" },
  { href: "/automation-tools-for-ai-workflows", label: "Best Automation Tools for AI Workflows" },
  { href: "/status", label: "Public operating status" },
  { href: "/affiliate-disclosure", label: "Affiliate disclosure" }
];

export default function PartnerProgramsPage() {
  const readyPrograms = affiliatePrograms.filter((program) => program.application_stage === "ready");

  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Affiliate application profile</span>
        <h1>Partner-ready deal intelligence for builder software.</h1>
        <p>
          Builder Deals Intel promotes source-backed offers to founders, engineers, indie builders, and operators who
          compare AI tools, SaaS, hosting, cloud credits, automation, and developer infrastructure.
        </p>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Promotion model</strong>
          <span>Buyer-intent SEO pages, source-labeled deal pages, daily brief, RSS/JSON feeds, and tracked outbound clicks.</span>
        </div>
        <div>
          <strong>Compliance</strong>
          <span>Affiliate links are disclosed. Paid placement cannot bypass source checks, risk labels, region notes, or editorial review.</span>
        </div>
        <div>
          <strong>Traffic stage</strong>
          <span>Early-stage audience, built around high-intent software buyers instead of broad coupon traffic or brand bidding.</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Application answers</h2>
            <p>Reusable profile copy for affiliate platforms and program managers.</p>
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
            <h2>Approval assets</h2>
            <p>Pages that show program fit before an affiliate manager reviews the site.</p>
          </div>
        </div>
        <div className="deal-grid">
          {priorityAssets.map((asset) => (
            <Link className="panel category-panel" href={asset.href} key={asset.href}>
              <h3>{asset.label}</h3>
              <p className="summary">Source-backed content, disclosure, and tracked buyer path.</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>First programs</h2>
            <p>These are the initial applications with the strongest audience fit.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table affiliate-table">
            <div className="admin-table-head">Program</div>
            <div className="admin-table-head">Category</div>
            <div className="admin-table-head">Network</div>
            <div className="admin-table-head">Commission</div>
            <div className="admin-table-head">Fit</div>
            <div className="admin-table-head">Apply</div>
            {readyPrograms.map((program) => (
              <div className="admin-table-row" key={program.name}>
                <div>
                  <strong>{program.name}</strong>
                  <span>{program.launch_asset}</span>
                </div>
                <div>{program.category.replace("_", " ")}</div>
                <div>{program.network}</div>
                <div>{program.commission}</div>
                <div>{program.fit}</div>
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
