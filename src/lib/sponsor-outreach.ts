export type SponsorOutreachItem = {
  segment: string;
  target: string;
  subject: string;
  pitch: string;
  ask: string;
};

export const sponsorOutreach: SponsorOutreachItem[] = [
  {
    segment: "AI tools",
    target: "AI coding assistants, workflow agents, API tools, and prompt/productivity apps",
    subject: "Verified launch placement for builder-facing AI offers",
    pitch:
      "Builder Deals Intel surfaces source-backed AI and software offers for founders, engineers, and operators. We can list verified credits, launch discounts, or limited-time offers with risk labels and tracked outbound clicks.",
    ask: "Send the offer URL, terms, eligible regions, expiration window, and tracking link or affiliate program URL."
  },
  {
    segment: "Hosting and domains",
    target: "Hosting, domain, email, CDN, VPS, and managed WordPress providers",
    subject: "Hosting deal placement for builders launching new projects",
    pitch:
      "Our hosting pages are built around launch intent: readers are comparing real costs, renewal notes, domains, email, and deployment services before buying.",
    ask: "Share first-term price, renewal price, included services, excluded regions, and affiliate or sponsor terms."
  },
  {
    segment: "SaaS and automation",
    target: "Automation platforms, newsletter tools, creator SaaS, analytics, and ops tools",
    subject: "SaaS discount placement with source-backed terms",
    pitch:
      "We do not publish generic coupon clutter. We package SaaS offers with source links, eligibility notes, billing risk, and a buyer path that makes the deal easier to trust.",
    ask: "Send the public promo page, billing restrictions, coupon code if any, commission or sponsorship terms, and preferred landing URL."
  }
];
