import type { DealCategory } from "./types";

export type MoneyPage = {
  slug: string;
  title: string;
  description: string;
  category: DealCategory;
  intent: string[];
  evaluation: string[];
};

export const moneyPages: MoneyPage[] = [
  {
    slug: "best-ai-deals",
    title: "Best AI Deals for Builders",
    description:
      "Verified AI tool discounts, workspace credits, API promotions, and launch offers for founders and technical teams.",
    category: "ai_tools",
    intent: ["AI subscriptions", "model/API credits", "team workspace promos", "launch-window discounts"],
    evaluation: [
      "Source must be official or clearly attributable.",
      "Eligibility and region must be visible before publishing.",
      "Token or unverifiable airdrop claims stay out of auto-publish."
    ]
  },
  {
    slug: "free-cloud-credits",
    title: "Free Cloud Credits and Startup Infrastructure Offers",
    description:
      "Cloud, API, hosting, GPU, and infrastructure credit programs that help builders test products before paid scale.",
    category: "cloud_credits",
    intent: ["cloud free trials", "startup credits", "API credits", "hosting credits"],
    evaluation: [
      "Billing and auto-renewal risks are labeled.",
      "Credit value and expiration terms must be source-backed.",
      "Student-only or startup-only eligibility is clearly flagged."
    ]
  },
  {
    slug: "developer-tool-discounts",
    title: "Developer Tool Discounts and Builder Software Deals",
    description:
      "Discounts and free tiers for deployment, databases, monitoring, email APIs, automation, and developer workflows.",
    category: "developer_tools",
    intent: ["developer tools", "API platforms", "automation software", "monitoring and deployment"],
    evaluation: [
      "Free tiers are separated from limited-time discounts.",
      "Usage limits and commercial-use restrictions are surfaced.",
      "Affiliate links cannot replace source verification."
    ]
  }
];

export function getMoneyPage(slug: string) {
  return moneyPages.find((page) => page.slug === slug);
}
