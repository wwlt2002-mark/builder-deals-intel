import type { AffiliateProgram } from "./affiliate-programs";
import { sponsorPackages } from "./sponsor-packages";
import type { Deal } from "./types";

export type RevenueReadiness = {
  affiliateReadyDeals: number;
  applicationReadyPrograms: number;
  highPriorityPrograms: number;
  missingAffiliateUrls: number;
  sponsoredInventory: string[];
  payoutSetupNeeded: string[];
  nextMoves: string[];
};

export function getRevenueReadiness(deals: Deal[], programs: AffiliateProgram[]): RevenueReadiness {
  const publishedDeals = deals.filter((deal) => deal.status === "auto_published");
  const affiliateReadyDeals = publishedDeals.filter(
    (deal) => deal.is_affiliate && deal.affiliate_url && ["approved", "active"].includes(deal.affiliate_status)
  ).length;
  const applicationReadyPrograms = programs.filter(
    (program) => program.priority === "high" || /^Apply/i.test(program.next_step)
  ).length;
  const highPriorityPrograms = programs.filter((program) => program.priority === "high").length;
  const missingAffiliateUrls = publishedDeals.filter(
    (deal) => deal.affiliate_status !== "none" && !deal.affiliate_url
  ).length;

  const payoutSetupNeeded = Array.from(
    new Set(
      programs
        .filter((program) => program.priority !== "low")
        .map((program) => program.payout)
        .filter((payout) => /required|minimum|account/i.test(payout))
    )
  ).slice(0, 4);

  const nextMoves = [
    "Apply to the high-priority programs once payout account details are available.",
    "Replace direct product URLs with approved affiliate URLs as each program is accepted.",
    "Sell one labeled newsletter or category test placement before adding display ads."
  ];

  return {
    affiliateReadyDeals,
    applicationReadyPrograms,
    highPriorityPrograms,
    missingAffiliateUrls,
    sponsoredInventory: sponsorPackages.map((sponsorPackage) => sponsorPackage.name),
    payoutSetupNeeded,
    nextMoves
  };
}
