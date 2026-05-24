import type { AffiliateProgram } from "./affiliate-programs";

export type ApplicationCopy = {
  label: string;
  value: string;
};

const categoryAssets = {
  ai_tools: ["https://builderdealintel.com/best-ai-deals", "https://builderdealintel.com"],
  saas: ["https://builderdealintel.com/saas-discounts", "https://builderdealintel.com/newsletter-tools-for-builders"],
  developer_tools: [
    "https://builderdealintel.com/developer-tool-discounts",
    "https://builderdealintel.com/automation-tools-for-ai-workflows"
  ],
  cloud_credits: ["https://builderdealintel.com/free-cloud-credits", "https://builderdealintel.com/developer-tool-discounts"],
  hosting: ["https://builderdealintel.com/hosting-deals", "https://builderdealintel.com/hosting-for-saas-projects"]
} as const;

export const applicationCopy: ApplicationCopy[] = [
  {
    label: "Website URL",
    value: "https://builderdealintel.com"
  },
  {
    label: "Business contact",
    value: "partnerships@builderdealintel.com"
  },
  {
    label: "Short description",
    value:
      "Builder Deals Intel is a source-labeled deal intelligence site for builders who buy AI tools, SaaS products, hosting, cloud credits, API platforms, and developer infrastructure."
  },
  {
    label: "Audience",
    value:
      "Our audience is made up of builders with active software buying intent: founders validating products, engineers choosing tools, indie hackers launching projects, and operators comparing SaaS, AI, automation, hosting, and cloud providers."
  },
  {
    label: "Promotion methods",
    value:
      "We promote partner offers through source-labeled deal pages, category pages, buyer-intent SEO pages, newsletter brief placements, and clearly disclosed sponsored placements."
  },
  {
    label: "Traffic stage",
    value:
      "The site is early-stage. We do not claim mature traffic numbers yet; the strategy is to build high-intent organic and newsletter traffic around AI, SaaS, hosting, cloud credits, automation, and developer buying decisions."
  },
  {
    label: "Traffic sources",
    value:
      "Planned traffic sources are SEO pages, daily deal briefs, RSS and JSON feeds, direct visits, founder communities, developer communities, and partner-approved social distribution. We do not rely on trademark bidding or fake coupon search traffic."
  },
  {
    label: "Tracking approach",
    value:
      "Approved links are routed through transparent first-party outbound tracking so we can report clicks by page, placement, campaign, and program while keeping source links and disclosures visible."
  },
  {
    label: "Compliance",
    value:
      "Affiliate and sponsored links are disclosed. Paid partnerships do not bypass editorial checks, source verification, eligibility notes, region notes, expiration notes, or risk labels."
  },
  {
    label: "Content policy",
    value:
      "We do not publish fabricated prices, unsupported discount percentages, hidden terms, fake coupons, forced scarcity, token promises, or partner claims that cannot be verified from a source."
  }
];

export function getProgramApplicationCopy(program: AffiliateProgram): ApplicationCopy[] {
  const contentAssets = categoryAssets[program.category] ?? ["https://builderdealintel.com"];

  return [
    {
      label: "Program fit",
      value: `${program.name} fits Builder Deals Intel because ${program.fit.toLowerCase()}`
    },
    {
      label: "Promotion plan",
      value: `We will promote ${program.name} through source-backed listings, relevant buyer-intent pages, newsletter mentions when appropriate, and transparent outbound click tracking.`
    },
    {
      label: "Relevant assets",
      value: contentAssets.join(" | ")
    },
    {
      label: "Compliance note",
      value:
        "We disclose affiliate links, preserve source verification, avoid trademark bidding and fake coupons, and keep paid relationships separate from editorial checks."
    }
  ];
}
