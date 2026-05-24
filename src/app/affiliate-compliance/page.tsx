import Link from "next/link";

export const metadata = {
  title: "Affiliate Compliance Policy | Builder Deals Intel",
  description: "Traffic, disclosure, paid search, coupon, and brand safety rules for Builder Deals Intel partnerships."
};

const policies = [
  {
    title: "No trademark bidding",
    body:
      "We do not bid on partner brand names, misspellings, domain names, or restricted trademark terms in paid search unless a program gives explicit written permission."
  },
  {
    title: "No coupon stuffing",
    body:
      "We do not publish fabricated coupon codes, forced scarcity, browser-extension hijacks, cookie stuffing, hidden redirects, toolbar traffic, or misleading discount claims."
  },
  {
    title: "Source-backed claims",
    body:
      "Every commercial offer needs a source URL, deal URL, terms, eligibility, region, price context, and expiration or promo-window notes when available."
  },
  {
    title: "Clear disclosure",
    body:
      "Affiliate and sponsored links are disclosed to readers. Commercial relationships do not change the requirement for source checks or risk labels."
  },
  {
    title: "Tracked first-party links",
    body:
      "Outbound links may pass through /out routes so we can measure placement, campaign, affiliate network, and sponsor performance without hiding the destination."
  },
  {
    title: "Review-first risk categories",
    body:
      "User submissions, open-web claims, token or airdrop offers, unclear expiration dates, and unusually large discounts stay in review until verified."
  }
];

export default function AffiliateCompliancePage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Affiliate compliance</span>
        <h1>Brand-safe promotion rules for partner programs.</h1>
        <p>
          Builder Deals Intel is built for long-term partner trust. We focus on source-backed content, buyer-intent
          pages, newsletter distribution, and transparent tracking instead of aggressive coupon or paid-search tactics.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/partner-programs">
            Application profile
          </Link>
          <Link className="secondary-button" href="/affiliate-disclosure">
            Disclosure
          </Link>
        </div>
      </section>

      <section className="legal-grid">
        {policies.map((policy) => (
          <div className="panel" key={policy.title}>
            <h2>{policy.title}</h2>
            <p className="summary">{policy.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
