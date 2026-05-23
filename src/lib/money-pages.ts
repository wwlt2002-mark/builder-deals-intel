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
  sponsorFit: {
    audience: string;
    package: string;
    buyerPath: string;
  };
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
    ],
    sponsorFit: {
      audience: "AI tool buyers, founders testing new workflows, and teams comparing model/API subscriptions.",
      package: "Newsletter sponsor or category feature for verified AI tool offers.",
      buyerPath: "Readers compare the offer, inspect risk labels, then click through the tracked deal route."
    }
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
    ],
    sponsorFit: {
      audience: "Developers, startup founders, and operators evaluating cloud, hosting, API, and infrastructure credits.",
      package: "Launch monitoring or category feature for cloud, hosting, API, and infrastructure providers.",
      buyerPath: "Readers check eligibility and billing risk before opening the provider source or tracked offer."
    }
  },
  {
    slug: "hosting-deals",
    title: "Hosting Deals, Domain Discounts, and Launch Infrastructure Offers",
    description:
      "Verified hosting, domain, email, CDN, and deployment offers for builders launching sites, apps, and client projects.",
    category: "hosting",
    intent: ["hosting deals", "domain discounts", "startup website stack", "deployment offers"],
    evaluation: [
      "Renewal price and first-year pricing must be separated when visible.",
      "Free domain, email, CDN, and backup terms are labeled instead of treated as guaranteed.",
      "Hosting affiliate links need source-backed pricing and clear disclosure before promotion."
    ],
    faqs: [
      {
        question: "Are first-year hosting discounts safe to compare?",
        answer:
          "They are useful, but renewal pricing can change the real cost. We label first-term pricing, renewal risk, and bundled extras when the source shows them."
      },
      {
        question: "Do hosting deals include domains?",
        answer:
          "Yes. Domain, email, SSL, CDN, and migration extras can be listed when they are part of a hosting or launch bundle."
      },
      {
        question: "Why is hosting a priority category?",
        answer:
          "Hosting has strong buyer intent, clear affiliate economics, and a practical fit for founders and builders who need to launch quickly."
      }
    ],
    sponsorFit: {
      audience: "Founders, indie builders, agencies, and operators choosing hosting, domains, email, and deployment services.",
      package: "Affiliate partnership or launch monitoring package for verified hosting and domain offers.",
      buyerPath: "Readers compare pricing, renewal notes, and included services before opening the tracked provider link."
    }
  },
  {
    slug: "saas-discounts",
    title: "SaaS Discounts and Startup Software Deals",
    description:
      "Verified SaaS discounts, annual-plan offers, creator tools, automation platforms, and productivity software deals.",
    category: "saas",
    intent: ["SaaS discounts", "annual plan offers", "creator tools", "automation software"],
    evaluation: [
      "Annual discounts are labeled separately from limited-time promotions.",
      "Seat limits, usage limits, and trial-to-paid billing risk are surfaced.",
      "User-submitted SaaS deals stay in review until the source and commercial terms are clear."
    ],
    faqs: [
      {
        question: "What SaaS offers are included?",
        answer:
          "We cover productivity, automation, creator, marketing, analytics, and operations tools when the discount or credit is source-backed."
      },
      {
        question: "Are lifetime deals included?",
        answer:
          "Lifetime deals can be included, but only when refund terms, plan limits, and merchant quality are clear enough to review."
      },
      {
        question: "How can SaaS partners work with the site?",
        answer:
          "Relevant partners can use affiliate links, sponsored newsletter placements, or verified category placements without bypassing editorial checks."
      }
    ],
    sponsorFit: {
      audience: "Startup operators, creators, founders, and small teams comparing recurring software costs.",
      package: "Newsletter sponsor, affiliate partnership, or SaaS category placement.",
      buyerPath: "Readers inspect use case, discount type, risk labels, and source terms before clicking through."
    }
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
    ],
    sponsorFit: {
      audience: "Engineers and technical founders buying deployment, automation, email API, monitoring, and workflow tools.",
      package: "Affiliate partnership or sponsored category placement for developer tooling.",
      buyerPath: "Readers evaluate practical limits, commercial restrictions, and source quality before clicking out."
    }
  }
];

export function getMoneyPage(slug: string) {
  return moneyPages.find((page) => page.slug === slug);
}
