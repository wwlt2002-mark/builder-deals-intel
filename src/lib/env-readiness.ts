export type EnvironmentRequirement = {
  key: string;
  label: string;
  requiredFor: string;
  status: "configured" | "missing";
  ownerAction: string;
};

const requirements = [
  {
    key: "NEXT_PUBLIC_SITE_URL",
    label: "Canonical site URL",
    requiredFor: "SEO, redirects, sitemap, and robots.txt",
    fallbackConfigured: true,
    ownerAction: "No action needed unless the production domain changes."
  },
  {
    key: "ADMIN_SECRET",
    label: "Admin login secret",
    requiredFor: "Protected operations dashboard",
    fallbackConfigured: false,
    ownerAction: "Set a strong secret in Hostinger before public traffic scales."
  },
  {
    key: "DATABASE_URL",
    label: "Postgres database",
    requiredFor: "Deals, submissions, subscribers, clicks, sponsor leads, and affiliate state",
    fallbackConfigured: false,
    ownerAction: "Keep the current database connected; replace only during a planned migration."
  },
  {
    key: "OPENAI_API_KEY",
    label: "AI extraction key",
    requiredFor: "Source-backed submission drafting and future crawler extraction",
    fallbackConfigured: false,
    ownerAction: "Add an OpenAI API key when ready to use production AI extraction."
  },
  {
    key: "RESEND_API_KEY",
    label: "Resend API key",
    requiredFor: "Daily newsletter sending",
    fallbackConfigured: false,
    ownerAction: "Add Resend after the sender domain is verified."
  },
  {
    key: "NEWSLETTER_FROM_EMAIL",
    label: "Newsletter sender",
    requiredFor: "Branded email delivery",
    fallbackConfigured: false,
    ownerAction: "Set a verified sender such as Builder Deals Intel <brief@builderdealintel.com>."
  }
];

export function getEnvironmentReadiness(): EnvironmentRequirement[] {
  return requirements.map((item) => ({
    key: item.key,
    label: item.label,
    requiredFor: item.requiredFor,
    status: process.env[item.key] || item.fallbackConfigured ? "configured" : "missing",
    ownerAction: item.ownerAction
  }));
}
