import type { DealCategory } from "./types";

export const categories: Array<{
  id: DealCategory;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: "ai_tools",
    label: "AI Tools",
    shortLabel: "AI",
    description: "Model subscriptions, AI app discounts, API credits, and launch promos."
  },
  {
    id: "saas",
    label: "SaaS",
    shortLabel: "SaaS",
    description: "Recurring software, creator tools, productivity apps, and lifetime deals."
  },
  {
    id: "developer_tools",
    label: "Developer Tools",
    shortLabel: "Dev",
    description: "Code, testing, monitoring, analytics, databases, and builder workflows."
  },
  {
    id: "cloud_credits",
    label: "Cloud Credits",
    shortLabel: "Cloud",
    description: "Cloud, GPU, startup, API, and infrastructure credit programs."
  },
  {
    id: "hosting",
    label: "Hosting",
    shortLabel: "Hosting",
    description: "Hosting, domains, edge platforms, email, and deployment offers."
  }
];

export function getCategoryLabel(category: DealCategory) {
  return categories.find((item) => item.id === category)?.label ?? category;
}
