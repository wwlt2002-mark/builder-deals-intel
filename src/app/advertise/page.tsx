import Link from "next/link";
import { sponsorOutreach } from "@/lib/sponsor-outreach";
import { sponsorFaqs, sponsorPackages } from "@/lib/sponsor-packages";

export const metadata = {
  title: "Advertise | Builder Deals Intel",
  description: "Advertise to builders through verified deal placements, sponsorships, and affiliate partnerships.",
  alternates: {
    canonical: "/advertise"
  },
  openGraph: {
    title: "Advertise | Builder Deals Intel",
    description: "Advertise to builders through verified deal placements, sponsorships, and affiliate partnerships.",
    url: "/advertise",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Advertise | Builder Deals Intel",
    description: "Verified deal placements, sponsorships, and affiliate partnerships for builder software brands."
  }
};

const dealPaths = [
  { href: "/best-ai-deals", label: "AI deals" },
  { href: "/saas-discounts", label: "SaaS discounts" },
  { href: "/hosting-deals", label: "Hosting deals" },
  { href: "/free-cloud-credits", label: "Cloud credits" }
];

export default function AdvertisePage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Advertise</span>
        <h1>Advertise to builders through verified deal intelligence.</h1>
        <p>
          Builder Deals Intel accepts labeled sponsorships, affiliate partnerships, and launch monitoring for products
          that have clear source terms and a real buyer path for technical audiences.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/sponsor">
            Send offer
          </Link>
          <Link className="secondary-button" href="/media-kit">
            Media kit
          </Link>
        </div>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Good fit</strong>
          <span>AI tools, SaaS, automation, hosting, domains, APIs, developer infrastructure, and cloud credits.</span>
        </div>
        <div>
          <strong>Not a fit</strong>
          <span>Unverifiable coupons, hidden terms, token promises, forced scarcity, or offers without a source page.</span>
        </div>
        <div>
          <strong>Measurement</strong>
          <span>Tracked outbound clicks by page, placement, campaign, and approved affiliate or sponsor URL.</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Buyable placements</h2>
            <p>Start with a small, labeled test before scaling into recurring sponsorship.</p>
          </div>
        </div>
        <div className="deal-grid">
          {sponsorPackages.map((item) => (
            <article className="panel sponsor-card" key={item.name}>
              <h3>{item.name}</h3>
              <strong>{item.price}</strong>
              <p className="summary">{item.included}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Buyer-intent surfaces</h2>
            <p>Advertisers can align offers with pages where readers are already comparing tools.</p>
          </div>
        </div>
        <div className="deal-grid">
          {dealPaths.map((path) => (
            <Link className="panel category-panel" href={path.href} key={path.href}>
              <h3>{path.label}</h3>
              <p className="summary">Source-backed offers, risk labels, and tracked outbound intent.</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Partner segments</h2>
            <p>These are the first advertiser categories we can package cleanly.</p>
          </div>
        </div>
        <div className="deal-grid">
          {sponsorOutreach.map((item) => (
            <article className="panel sponsor-card" key={item.segment}>
              <h3>{item.segment}</h3>
              <strong>{item.subject}</strong>
              <p className="summary">{item.pitch}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Advertiser rules</h2>
            <p>Rules stay simple so readers and partners can trust the placement.</p>
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
