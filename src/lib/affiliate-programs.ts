import programsJson from "../../data/affiliate-programs.json";
import type { DealCategory } from "./types";

export type AffiliateProgram = {
  name: string;
  category: DealCategory;
  fit: string;
  network: string;
  commission: string;
  payout: string;
  next_step: string;
  application_stage: "ready" | "content_needed" | "watch";
  owner_blocker: string;
  launch_asset: string;
  priority: "high" | "medium" | "low";
  url: string;
  source_url: string;
};

export const affiliatePrograms = programsJson as AffiliateProgram[];
