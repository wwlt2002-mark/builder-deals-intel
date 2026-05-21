import programsJson from "../../data/affiliate-programs.json";
import type { DealCategory } from "./types";

export type AffiliateProgram = {
  name: string;
  category: DealCategory;
  fit: string;
  network: string;
  priority: "high" | "medium" | "low";
  url: string;
};

export const affiliatePrograms = programsJson as AffiliateProgram[];
