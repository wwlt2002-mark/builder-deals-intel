export type DealCategory =
  | "ai_tools"
  | "saas"
  | "developer_tools"
  | "cloud_credits"
  | "hosting";

export type DealStatus =
  | "draft"
  | "auto_published"
  | "needs_review"
  | "rejected"
  | "expired";

export type SourceType =
  | "official"
  | "trusted_community"
  | "open_web"
  | "user_submission";

export type Deal = {
  id: string;
  slug: string;
  title: string;
  product_name: string;
  merchant: string;
  category: DealCategory;
  original_price: string | null;
  deal_price: string | null;
  discount_summary: string;
  region: string;
  expires_at: string | null;
  source_url: string;
  deal_url: string;
  affiliate_url: string | null;
  is_affiliate: boolean;
  source_type: SourceType;
  confidence_score: number;
  risk_tags: string[];
  ai_summary: string;
  status: DealStatus;
  last_checked_at: string;
};

export type Submission = {
  id: string;
  submitted_url: string;
  submitter_email: string | null;
  relationship: string;
  submitter_note: string | null;
  generated_deal_id: string | null;
  status: string;
  created_at: string;
};

export type SourceConfig = {
  name: string;
  url: string;
  category: DealCategory;
  source_type: SourceType;
  auto_publish_threshold: number;
};
