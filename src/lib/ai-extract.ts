import type { DealUpdateInput } from "./deals";
import type { DealCategory } from "./types";

type ExtractionInput = {
  submittedUrl: string;
  note: string | null;
  relationship: string;
};

const categories: DealCategory[] = ["ai_tools", "saas", "developer_tools", "cloud_credits", "hosting"];
const defaultModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

function cleanText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

function inferCategory(url: string, text: string): DealCategory {
  const haystack = `${url} ${text}`.toLowerCase();

  if (/hosting|domain|wordpress|vps|cdn|deploy|vercel|netlify/.test(haystack)) return "hosting";
  if (/cloud|credit|aws|azure|google cloud|gpu|compute/.test(haystack)) return "cloud_credits";
  if (/api|developer|database|monitoring|github|gitlab|testing|email api/.test(haystack)) return "developer_tools";
  if (/ai|llm|model|openai|claude|agent|copilot/.test(haystack)) return "ai_tools";
  return "saas";
}

function merchantFromUrl(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const name = host.split(".")[0] ?? "Submitted offer";
    return name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  } catch {
    return "Submitted offer";
  }
}

async function fetchSourceSnapshot(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "BuilderDealsIntelBot/1.0 (+https://builderdealintel.com)"
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return "";
    }

    return cleanText(await response.text());
  } catch {
    return "";
  }
}

function fallbackCandidate(input: ExtractionInput, sourceText: string): DealUpdateInput {
  const merchant = merchantFromUrl(input.submittedUrl);
  const category = inferCategory(input.submittedUrl, `${sourceText} ${input.note ?? ""}`);
  const riskTags = ["user-submission", "needs-review"];

  if (input.relationship !== "I am not affiliated with this merchant") {
    riskTags.push("submitter-affiliated");
  }

  return {
    title: `${merchant} submitted deal for review`,
    product_name: merchant,
    merchant,
    category,
    original_price: null,
    deal_price: "Needs verification",
    discount_summary: input.note || "Submitted offer awaiting source-backed price, eligibility, and expiration checks.",
    region: "Global, terms need verification",
    expires_at: null,
    source_url: input.submittedUrl,
    deal_url: input.submittedUrl,
    affiliate_url: null,
    is_affiliate: false,
    affiliate_network: null,
    affiliate_program: null,
    affiliate_status: "none",
    affiliate_notes: null,
    source_type: "user_submission",
    confidence_score: sourceText ? 55 : 45,
    risk_tags: riskTags,
    ai_summary:
      "User-submitted offer queued for editorial review. Do not publish until the source page confirms price, eligibility, region, and expiration.",
    status: "needs_review"
  };
}

function extractResponseText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  return output
    .flatMap((item) => (typeof item === "object" && item && "content" in item ? item.content : []))
    .flatMap((content) => (typeof content === "object" && content && "text" in content ? [String(content.text)] : []))
    .join("\n");
}

function normalizeAiCandidate(raw: Partial<DealUpdateInput>, fallback: DealUpdateInput): DealUpdateInput {
  const category = categories.includes(raw.category as DealCategory) ? (raw.category as DealCategory) : fallback.category;
  const confidence = Number(raw.confidence_score ?? fallback.confidence_score);
  const riskTags = Array.isArray(raw.risk_tags) ? raw.risk_tags.map(String).filter(Boolean) : fallback.risk_tags;

  return {
    ...fallback,
    ...raw,
    category,
    source_url: fallback.source_url,
    deal_url: raw.deal_url || fallback.deal_url,
    affiliate_url: null,
    is_affiliate: false,
    affiliate_network: null,
    affiliate_program: null,
    affiliate_status: "none",
    affiliate_notes: null,
    source_type: "user_submission",
    confidence_score: Math.max(35, Math.min(82, Number.isFinite(confidence) ? confidence : fallback.confidence_score)),
    risk_tags: Array.from(new Set([...riskTags, "user-submission", "needs-review"])),
    status: "needs_review"
  };
}

export async function extractSubmittedDeal(input: ExtractionInput): Promise<DealUpdateInput> {
  const sourceText = await fetchSourceSnapshot(input.submittedUrl);
  const fallback = fallbackCandidate(input, sourceText);

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: defaultModel,
      instructions:
        "Extract only source-backed deal facts. Return compact JSON for Builder Deals Intel. Never invent price, expiration, region, coupon, or affiliate terms. User submissions must remain needs_review.",
      input: [
        `Submitted URL: ${input.submittedUrl}`,
        `Submitter relationship: ${input.relationship}`,
        `Submitter note: ${input.note ?? ""}`,
        `Source text: ${sourceText || "Unable to fetch source text."}`,
        `JSON keys: title, product_name, merchant, category, original_price, deal_price, discount_summary, region, expires_at, deal_url, confidence_score, risk_tags, ai_summary. Category must be one of ${categories.join(", ")}. expires_at must be null or ISO date.`
      ].join("\n\n"),
      max_output_tokens: 900
    })
  });

  if (!response.ok) {
    return fallback;
  }

  try {
    const payload = (await response.json()) as Record<string, unknown>;
    const text = extractResponseText(payload);
    const json = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
    return normalizeAiCandidate(json, fallback);
  } catch {
    return fallback;
  }
}
