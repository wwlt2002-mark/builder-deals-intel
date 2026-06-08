import Link from "next/link";

export const metadata = {
  title: "About | Builder Deals Intel",
  description:
    "About Builder Deals Intel, an independent source-backed publication tracking AI, SaaS, hosting, cloud, and developer tool offers for builders.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About Builder Deals Intel",
    description:
      "An independent source-backed publication tracking AI, SaaS, hosting, cloud, and developer tool offers for builders.",
    url: "/about",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "About Builder Deals Intel",
    description:
      "An independent source-backed publication tracking AI, SaaS, hosting, cloud, and developer tool offers for builders."
  }
};

const principles = [
  {
    title: "Source-backed listings",
    body: "Every published listing needs a source URL, visible terms, risk labels, and a last-checked timestamp."
  },
  {
    title: "Builder-first coverage",
    body: "We focus on tools that help founders, engineers, creators, and small teams build, launch, automate, and monetize."
  },
  {
    title: "Commercial transparency",
    body: "Affiliate and sponsored relationships are labeled. Editorial usefulness comes before payout potential."
  }
];

const workflow = [
  "Monitor official pricing pages, launch programs, partner pages, and high-trust builder sources.",
  "Extract offer details, eligibility notes, pricing context, risk tags, and source links.",
  "Publish high-confidence official listings and keep uncertain community or user-submitted items in review.",
  "Track outbound clicks and corrections so future partner conversations can be backed by evidence."
];

export default function AboutPage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">About</span>
        <h1>Builder Deals Intel tracks useful software offers for people building on the internet.</h1>
        <p>
          Builder Deals Intel is an independent deal intelligence publication for AI tools, SaaS, hosting, cloud
          credits, developer tools, newsletters, automation, and monetization platforms. The goal is to help builders
          find credible offers without digging through noisy coupon feeds.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/deals">
            Browse all deals
          </Link>
          <Link className="secondary-button" href="/contact">
            Contact us
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
          <strong>Business contact</strong>
          <a href="mailto:partnerships@builderdealintel.com">partnerships@builderdealintel.com</a>
        </div>
        <div>
          <strong>Editorial contact</strong>
          <a href="mailto:editorial@builderdealintel.com">editorial@builderdealintel.com</a>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Editorial principles</h2>
            <p>These rules are designed to make the site credible to readers, search engines, and partner managers.</p>
          </div>
        </div>
        <div className="deal-grid">
          {principles.map((principle) => (
            <article className="panel sponsor-card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p className="summary">{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>How listings are handled</h2>
            <p>The site combines structured data, editorial checks, and public source links.</p>
          </div>
        </div>
        <ol className="policy-list">
          {workflow.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Affiliate disclosure</strong>
          <span>Some links may become affiliate links. This does not change the price readers pay.</span>
        </div>
        <div>
          <strong>Corrections</strong>
          <span>Expired offers, changed prices, missing terms, or incorrect risk labels can be reported by email.</span>
        </div>
        <div>
          <strong>Partnerships</strong>
          <span>Vendors can request sponsor placements, verified offer pages, or media kit details.</span>
        </div>
      </section>
    </div>
  );
}
