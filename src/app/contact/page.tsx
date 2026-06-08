import Link from "next/link";

export const metadata = {
  title: "Contact | Builder Deals Intel",
  description: "Contact and business identity information for Builder Deals Intel.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: "Contact Builder Deals Intel",
    description: "Contact routes for Builder Deals Intel partnerships, editorial corrections, and compliance questions.",
    url: "/contact",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Contact Builder Deals Intel",
    description: "Contact routes for partnerships, editorial corrections, and compliance questions."
  }
};

const contacts = [
  {
    label: "Business and partnerships",
    value: "partnerships@builderdealintel.com",
    href: "mailto:partnerships@builderdealintel.com"
  },
  {
    label: "Deal corrections and editorial notes",
    value: "editorial@builderdealintel.com",
    href: "mailto:editorial@builderdealintel.com"
  }
];

export default function ContactPage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Contact</span>
        <h1>Contact Builder Deals Intel.</h1>
        <p>
          Builder Deals Intel is a deal intelligence publication for AI, SaaS, hosting, cloud, automation, and developer
          tools. Use this page for commercial partnerships, verified offer submissions, corrections, and compliance
          questions.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/sponsor">
            Start partnership
          </Link>
          <Link className="secondary-button" href="/media-kit">
            Media kit
          </Link>
        </div>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Public brand</strong>
          <span>Builder Deals Intel</span>
        </div>
        <div>
          <strong>Website</strong>
          <a href="https://builderdealintel.com">builderdealintel.com</a>
        </div>
        <div>
          <strong>Business focus</strong>
          <span>Source-backed deal intelligence, affiliate partnerships, sponsor placements, and buyer-intent content.</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Contact routes</h2>
            <p>Use the most relevant route so messages can be reviewed quickly.</p>
          </div>
        </div>
        <div className="deal-grid">
          {contacts.map((contact) => (
            <article className="panel sponsor-card" key={contact.label}>
              <h3>{contact.label}</h3>
              <a href={contact.href}>{contact.value}</a>
              <p className="summary">For verified offers, corrections, partnership terms, and review questions.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Commercial review</strong>
          <span>Affiliate and sponsored placements require source URLs, terms, eligibility notes, and clear tracking links.</span>
        </div>
        <div>
          <strong>Editorial corrections</strong>
          <span>Outdated prices, expired offers, and incorrect terms can be flagged for review or removal.</span>
        </div>
        <div>
          <strong>Privacy and compliance</strong>
          <span>Submitted contact details are used only for operating the site, partnership review, and requested follow-up.</span>
        </div>
      </section>
    </div>
  );
}
