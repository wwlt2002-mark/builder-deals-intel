import Link from "next/link";

export const metadata = {
  title: "Editorial Policy | Builder Deals Intel",
  description:
    "How Builder Deals Intel verifies sources, labels commercial relationships, handles submissions, and ranks AI, SaaS, hosting, and developer deals."
};

const standards = [
  {
    title: "Source-first verification",
    body:
      "Every listing needs a source URL. Official pages, pricing pages, partner terms, changelogs, and verified program pages outrank screenshots, reposts, and unsourced community claims."
  },
  {
    title: "Structured risk labels",
    body:
      "We label renewal pricing, billing-card requirements, region restrictions, expiration uncertainty, user-submitted claims, and unusually large discounts before a reader clicks out."
  },
  {
    title: "Commercial separation",
    body:
      "Affiliate commissions and sponsorships can affect tracking and placement availability, but they cannot remove source links, risk notes, or review requirements."
  },
  {
    title: "Review-first submissions",
    body:
      "User submissions, open-web discoveries, token-adjacent offers, unclear prices, and unverifiable expiration windows stay in review until the facts are supported."
  },
  {
    title: "No artificial scarcity",
    body:
      "We do not invent countdowns, discounts, coupon codes, savings percentages, eligibility rules, or product claims. Unknown fields remain unknown until the source confirms them."
  },
  {
    title: "Correction path",
    body:
      "Partners and readers can flag outdated terms or broken claims. We update, expire, or remove listings when source terms change or verification fails."
  }
];

export default function EditorialPolicyPage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Editorial policy</span>
        <h1>Trust rules for deal intelligence, ranking, and partner content.</h1>
        <p>
          Builder Deals Intel exists to help builders find useful AI, SaaS, cloud, hosting, and developer offers without
          guessing whether the terms are real. The site is commercial, but the editorial system is source-backed.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/status">
            Operating status
          </Link>
          <Link className="secondary-button" href="/affiliate-compliance">
            Compliance policy
          </Link>
        </div>
      </section>

      <section className="legal-grid">
        {standards.map((standard) => (
          <div className="panel" key={standard.title}>
            <h2>{standard.title}</h2>
            <p className="summary">{standard.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
