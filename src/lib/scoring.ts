import type { Deal, SourceType } from "./types";

const sourceBaseScore: Record<SourceType, number> = {
  official: 88,
  trusted_community: 72,
  open_web: 58,
  user_submission: 45
};

export function shouldAutoPublish(deal: Pick<Deal, "confidence_score" | "source_type" | "risk_tags">) {
  if (deal.risk_tags.some((tag) => ["token", "airdrop", "crypto", "needs-review", "price-anomaly"].includes(tag))) {
    return false;
  }

  if (deal.source_type === "official") {
    return deal.confidence_score >= 85;
  }

  if (deal.source_type === "trusted_community") {
    return deal.confidence_score >= 90;
  }

  return false;
}

export function estimateConfidence(sourceType: SourceType, riskTags: string[]) {
  const penalty = riskTags.length * 4;
  return Math.max(0, Math.min(100, sourceBaseScore[sourceType] - penalty));
}
