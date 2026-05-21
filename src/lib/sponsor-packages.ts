export type SponsorPackage = {
  name: string;
  price: string;
  bestFor: string;
  included: string;
  proof: string;
};

export const sponsorPackages: SponsorPackage[] = [
  {
    name: "Newsletter sponsor",
    price: "$150-$500 test",
    bestFor: "SaaS, AI tools, APIs, hosting, and launch offers that need quick signal from builders.",
    included: "One labeled placement in the daily Top 10 Deals for Builders brief, plus source and terms review.",
    proof: "Tracked outbound clicks, sponsor lead status, and placement notes in the operations desk."
  },
  {
    name: "Category feature",
    price: "$250-$750 test",
    bestFor: "Offers that match a buyer category such as AI Tools, SaaS, Developer Tools, Cloud Credits, or Hosting.",
    included: "Verified listing on the relevant category page with eligibility notes, risk labels, and tracking route.",
    proof: "Deal page visibility, category placement, and affiliate or sponsor click reporting."
  },
  {
    name: "Launch monitoring",
    price: "$300-$1,000 window",
    bestFor: "Vendors running limited-time promos, cloud credit campaigns, lifetime deals, or seasonal launches.",
    included: "Monitoring of official promo terms and surfaced updates when price, eligibility, or expiry changes.",
    proof: "Last-checked timestamps, source URL preservation, and change-aware editorial notes."
  },
  {
    name: "Affiliate partnership",
    price: "CPA or rev share",
    bestFor: "Partner programs with clean tracking URLs, public terms, and a product useful to technical buyers.",
    included: "Affiliate disclosure, source-labeled deal page, tracked outbound redirect, and status management.",
    proof: "Affiliate click counts, network field, program status, and payout readiness tracking."
  }
];

export function getSponsorOfferCatalog() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Builder Deals Intel sponsor packages",
    url: "https://builderdealintel.com/sponsor",
    itemListElement: sponsorPackages.map((sponsorPackage) => ({
      "@type": "Offer",
      name: sponsorPackage.name,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        description: sponsorPackage.price
      },
      description: `${sponsorPackage.bestFor} ${sponsorPackage.included}`
    }))
  };
}
