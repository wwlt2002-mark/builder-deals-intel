export type OwnerAction = {
  title: string;
  trigger: string;
  why: string;
  status: "waiting" | "ready" | "blocked";
};

export const ownerActions: OwnerAction[] = [
  {
    title: "OpenAI API key",
    trigger: "When production AI extraction should replace conservative fallback drafting.",
    why: "Needed for richer source-backed extraction from user submissions and monitored offer pages.",
    status: "waiting"
  },
  {
    title: "Resend sender domain and API key",
    trigger: "When the first real subscribers are ready to receive daily brief emails.",
    why: "Needed to send the daily Top 10 Deals for Builders without manual copying.",
    status: "waiting"
  },
  {
    title: "Affiliate payout profile",
    trigger: "When Hostinger, Beehiiv, Make, or another program asks for PayPal, bank, tax, or identity details.",
    why: "Revenue cannot be withdrawn until payout and tax verification are complete.",
    status: "waiting"
  },
  {
    title: "First affiliate applications",
    trigger: "When the owner is available for account login, email verification, or identity checks.",
    why: "Approved tracking links are the main path from traffic to cash revenue.",
    status: "ready"
  },
  {
    title: "First sponsor invoice or payment method",
    trigger: "When a partner accepts a newsletter sponsor, category feature, or launch monitoring test.",
    why: "Sponsored placements need a clean payment trail before publication.",
    status: "waiting"
  }
];
