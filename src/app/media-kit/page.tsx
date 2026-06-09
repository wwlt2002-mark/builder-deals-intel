import Link from "next/link";
import { applicationCopy } from "@/lib/application-copy";
import { sponsorOutreach } from "@/lib/sponsor-outreach";
import { sponsorFaqs, sponsorPackages } from "@/lib/sponsor-packages";

export const metadata = {
  title: "Media Kit | Builder Deals Intel",
  description: "Audience, sponsor inventory, commercial policy, and partner-ready assets for Builder Deals Intel.",
  alternates: {
    canonical: "/media-kit"
  },
  openGraph: {
    title: "Media Kit | Builder Deals Intel",
    description: "Audience, sponsor inventory, commercial policy, and partner-ready assets for Builder Deals Intel.",
    url: "/media-kit",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Media Kit | Builder Deals Intel",
    description: "Partner-ready audience and sponsor inventory for Builder Deals Intel."
  }
};

export default function MediaKitPage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Media kit</span>
        <h1>Partner-ready media kit for builder software offers.</h1>
        <p>
          Builder Deals Intel is built for AI, SaaS, hosting, cloud, automation, and developer-tool vendors who want
          source-backed placements rather than generic coupon traffic.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/sponsor">
            Start partnership
          </Link>
          <Link className="secondary-button" href="/partner-programs">
            Affiliate profile
          </Link>
          <Link className="secondary-button" href="/commercial-proof">
            Proof report
          </Link>
        </div>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Public brand</strong>
          <span>Builder Deals Intel</span>
        </div>
        <div>
          <strong>Business contact</strong>
          <a href="mailto:partnerships@builderdealintel.com">partnerships@builderdealintel.com</a>
        </div>
        <div>
          <strong>Audience</strong>
          <span>Founders, engineers, indie builders, operators, and creators comparing tools before buying.</span>
        </div>
        <div>
          <strong>Positioning</strong>
          <span>Daily AI, SaaS, and developer deals intelligence for builders.</span>
        </div>
        <div>
          <strong>Commercial model</strong>
          <span>Affiliate commissions first, then labeled newsletter sponsorships and category placements.</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Sponsor inventory</h2>
            <p>Paid placements are labeled and require verifiable terms before publication.</p>
          </div>
        </div>
        <div className="deal-grid">
          {sponsorPackages.map((item) => (
            <article className="panel sponsor-card" key={item.name}>
              <h3>{item.name}</h3>
              <strong>{item.price}</strong>
              <p className="summary">{item.bestFor}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Best-fit categories</h2>
            <p>These partner segments match the site&apos;s first revenue path.</p>
          </div>
        </div>
        <div className="deal-grid">
          {sponsorOutreach.map((item) => (
            <article className="panel sponsor-card" key={item.segment}>
              <h3>{item.segment}</h3>
              <strong>{item.target}</strong>
              <p className="summary">{item.ask}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Partner answers</h2>
            <p>Reusable profile details for affiliate managers and sponsor reviews.</p>
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
            <h2>Review FAQ</h2>
            <p>Commercial rules that protect partners and readers.</p>
          </div>
        </div>
        <div className="deal-grid">
          {sponsorFaqs.map((faq) => (
            <article className="panel sponsor-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p className="summary">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
