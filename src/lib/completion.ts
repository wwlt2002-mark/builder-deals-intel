import type { AffiliateProgram } from "./affiliate-programs";
import type { Deal, SponsorLead, Subscriber } from "./types";

export type CompletionAssessment = {
  percent: number;
  reason: string;
  strengths: string[];
  gaps: string[];
};

export function getCompletionAssessment(input: {
  deals: Deal[];
  subscribers: Subscriber[];
  sponsorLeads: SponsorLead[];
  affiliatePrograms: AffiliateProgram[];
  enabledSources: number;
  moneyPages?: number;
  aiExtractionReady?: boolean;
  environmentDashboardReady?: boolean;
  commercialOutreachReady?: boolean;
  distributionFeedsReady?: boolean;
  publicStatusReady?: boolean;
  businessEmailReady?: boolean;
  affiliateApprovalReady?: boolean;
}) {
  const publishedDeals = input.deals.filter((deal) => deal.status === "auto_published");
  const reviewDeals = input.deals.filter((deal) => deal.status === "needs_review");
  const affiliateLinks = publishedDeals.filter((deal) => deal.is_affiliate && deal.affiliate_url);
  const readyPrograms = input.affiliatePrograms.filter((program) => program.application_stage === "ready");

  let percent = 52;

  if (publishedDeals.length >= 5) percent += 8;
  if (input.enabledSources >= 25) percent += 6;
  if (reviewDeals.length >= 10) percent += 5;
  if (readyPrograms.length >= 3) percent += 5;
  if (input.sponsorLeads.length > 0) percent += 3;
  if (input.subscribers.length > 0) percent += 4;
  if (affiliateLinks.length > 0) percent += 7;
  if ((input.moneyPages ?? 0) >= 5) percent += 3;
  if ((input.moneyPages ?? 0) >= 8) percent += 1;
  if (input.aiExtractionReady) percent += 2;
  if (input.environmentDashboardReady) percent += 1;
  if (input.commercialOutreachReady) percent += 1;
  if (input.distributionFeedsReady) percent += 1;
  if (input.publicStatusReady) percent += 1;
  if (input.businessEmailReady) percent += 3;
  if (input.affiliateApprovalReady) percent += 4;

  percent = Math.min(percent, 95);

  const gaps = [
    affiliateLinks.length ? "" : "no live approved affiliate tracking links",
    input.subscribers.length ? "" : "newsletter has no active subscriber base yet",
    input.businessEmailReady ? "" : "business email is not ready for affiliate approval",
    input.affiliateApprovalReady ? "" : "affiliate approval proof packet is not complete",
    input.aiExtractionReady
      ? "AI extraction is wired, but output quality still needs production monitoring"
      : "AI extraction of specific limited-time offers still needs production hardening"
  ].filter(Boolean);

  const strengths = [
    "site, admin, disclosure, sponsor, tracking, and source monitor are live",
    `${input.enabledSources} monitored sources are configured`,
    `${readyPrograms.length} affiliate programs are application-ready`,
    `${input.moneyPages ?? 0} buyer-intent SEO pages are live`,
    input.environmentDashboardReady ? "environment readiness is visible in admin" : "",
    input.commercialOutreachReady ? "commercial outreach scripts are ready" : "",
    input.distributionFeedsReady ? "RSS and JSON feeds are live for syndication" : "",
    input.publicStatusReady ? "public proof/status page is live" : "",
    input.businessEmailReady ? "business mailbox and editorial alias are ready" : "",
    input.affiliateApprovalReady ? "affiliate approval proof packet is ready" : ""
  ].filter(Boolean);

  return {
    percent,
    reason:
      "The product is commercially presentable, but sustained revenue still depends on real affiliate approvals, subscriber growth, and higher-quality automated extraction.",
    strengths,
    gaps
  };
}
