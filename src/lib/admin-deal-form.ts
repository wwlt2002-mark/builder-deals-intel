import type { DealUpdateInput } from "./deals";

export function normalizeAffiliateFields(input: DealUpdateInput): DealUpdateInput {
  const isAffiliate = Boolean(input.affiliate_url) || input.is_affiliate;
  const affiliateStatus = isAffiliate && input.affiliate_status === "none" ? "active" : input.affiliate_status;

  return {
    ...input,
    is_affiliate: isAffiliate,
    affiliate_status: affiliateStatus
  };
}

export function validateAffiliateFields(input: DealUpdateInput) {
  const errors: string[] = [];

  if (input.affiliate_status === "active" && !input.affiliate_url) {
    errors.push("Active affiliate deals need an affiliate URL before saving.");
  }

  if (input.is_affiliate && !input.affiliate_network) {
    errors.push("Affiliate-enabled deals need an affiliate network for reporting.");
  }

  return errors;
}
