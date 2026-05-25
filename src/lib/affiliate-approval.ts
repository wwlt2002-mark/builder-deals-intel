export type AffiliateApprovalItem = {
  label: string;
  status: "ready" | "needs_owner" | "needs_growth";
  proof: string;
  next: string;
};

export const affiliateApprovalItems: AffiliateApprovalItem[] = [
  {
    label: "Business contact",
    status: "ready",
    proof: "Public contact page, partnerships mailbox, editorial alias, and footer contact links are live.",
    next: "Use partnerships@builderdealintel.com for affiliate platforms and sponsor conversations."
  },
  {
    label: "Editorial trust",
    status: "ready",
    proof: "Editorial policy, affiliate disclosure, compliance policy, source labels, risk tags, and deal expiry rules are public.",
    next: "Keep every promoted deal tied to an original source and avoid unverifiable price claims."
  },
  {
    label: "Application proof pages",
    status: "ready",
    proof: "Partner program kit, media kit, sponsor page, commercial proof page, and category money pages are published.",
    next: "Link the most relevant fit page in each affiliate application instead of sending only the homepage."
  },
  {
    label: "Tracking infrastructure",
    status: "ready",
    proof: "Deals support affiliate URLs, network labels, campaign tags, outbound click tracking, and admin attribution tables.",
    next: "Paste approved affiliate links into the admin pipeline immediately after approval."
  },
  {
    label: "Payout profile",
    status: "needs_owner",
    proof: "The site can prepare applications, but payout accounts, tax forms, identity checks, and bank/PayPal details require owner action.",
    next: "Ask the owner only when a platform reaches payout, tax, identity, payment, or account verification steps."
  },
  {
    label: "Traffic evidence",
    status: "needs_growth",
    proof: "The site is credible for early-stage applications, but traffic and subscriber history are still limited.",
    next: "Prioritize programs that accept new publisher sites, then use click and subscriber data to unlock stricter programs."
  }
];

export function getAffiliateApprovalScore(items = affiliateApprovalItems) {
  const ready = items.filter((item) => item.status === "ready").length;
  const needsOwner = items.filter((item) => item.status === "needs_owner").length;
  const needsGrowth = items.filter((item) => item.status === "needs_growth").length;
  const percent = Math.round((ready / items.length) * 100);

  return {
    percent,
    ready,
    needsOwner,
    needsGrowth,
    reason:
      needsOwner || needsGrowth
        ? "Credibility and tracking are ready; payout identity steps and traffic proof still depend on owner/platform response and growth."
        : "Application proof, tracking, trust pages, and owner prerequisites are all ready."
  };
}
