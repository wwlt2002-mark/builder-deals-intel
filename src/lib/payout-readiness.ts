export type PayoutReadinessItem = {
  item: string;
  neededFor: string;
  prepare: string;
  askOwnerWhen: string;
};

export const payoutReadinessItems: PayoutReadinessItem[] = [
  {
    item: "PayPal or bank payout destination",
    neededFor: "Hostinger, PartnerStack, Impact, Rewardful, and direct sponsor payments.",
    prepare: "Use the owner-controlled business PayPal or bank details that should receive revenue.",
    askOwnerWhen: "A platform will not let the application proceed without payout details."
  },
  {
    item: "Tax form profile",
    neededFor: "US and international affiliate networks before commissions can be released.",
    prepare: "Legal name, address, country, taxpayer classification, and the relevant W-8 or W-9 path.",
    askOwnerWhen: "The network opens tax onboarding or blocks payout activation."
  },
  {
    item: "Identity or business verification",
    neededFor: "Affiliate networks, sponsor invoicing, and fraud-prevention checks.",
    prepare: "Government ID or business registration details only if the platform explicitly requests them.",
    askOwnerWhen: "A manual verification step appears in the partner dashboard."
  },
  {
    item: "Program login and email verification",
    neededFor: "Submitting applications, receiving approvals, and retrieving approved tracking links.",
    prepare: "Use the owner email account and keep approval emails searchable by program name.",
    askOwnerWhen: "A login code, password manager, or email confirmation is required."
  }
];
