import type { DealCategory } from "./types";

export type MoneyPage = {
  slug: string;
  title: string;
  description: string;
  category: DealCategory;
  intent: string[];
  evaluation: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
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
    ],
    faqs: [
      {
        question: "What counts as an AI deal?",
        answer:
          "We include verified discounts, credits, workspace promotions, and trial offers for AI apps, model APIs, coding tools, and builder workflows."
      },
      {
        question: "Are token or airdrop offers included?",
        answer:
          "No. Token, airdrop, and unverifiable reward offers stay out of automatic publishing because they create compliance and trust risk."
      },
      {
        question: "How are AI deals ranked?",
        answer:
          "Official source quality, eligibility clarity, billing risk, expiration certainty, and practical builder value all affect ranking."
      }
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
    ],
    faqs: [
      {
        question: "Do free cloud credits require a credit card?",
        answer:
          "Many cloud credit and trial offers require billing details. We flag card and auto-billing risk when the source terms make that clear."
      },
      {
        question: "Are startup-only credits listed?",
        answer:
          "Yes, but eligibility restrictions must be visible. Student-only, startup-only, and region-limited offers are labeled."
      },
      {
        question: "Can cloud credit terms change?",
        answer:
          "Yes. Cloud providers can change credit values, usage limits, and promo windows, so each listing includes a source link and last-checked time."
      }
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
    ],
    faqs: [
      {
        question: "Are free tiers considered discounts?",
        answer:
          "Free tiers are listed when they are commercially useful to builders, but we separate always-free plans from limited-time deals."
      },
      {
        question: "What developer tools are covered?",
        answer:
          "We cover deployment, email APIs, databases, monitoring, automation, testing, analytics, and other software used to build and operate products."
      },
      {
        question: "How do affiliate links affect ranking?",
        answer:
          "Affiliate links do not replace source checks. A deal still needs clear terms, eligibility notes, risk labels, and a useful buyer path."
      }
    ]
  }
];

export function getMoneyPage(slug: string) {
  return moneyPages.find((page) => page.slug === slug);
}
