import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Builder Deals Intel",
  description: "Daily AI, SaaS, and developer deals intelligence for builders.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdealintel.com"),
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
      "application/feed+json": "/feed.json"
    }
  }
};

const navItems = [
  { href: "/", label: "Today" },
  { href: "/daily-brief", label: "Brief" },
  { href: "/categories/ai_tools", label: "AI" },
  { href: "/categories/saas", label: "SaaS" },
  { href: "/categories/developer_tools", label: "Dev Tools" },
  { href: "/hosting-deals", label: "Hosting" },
  { href: "/free-cloud-credits", label: "Cloud Credits" },
  { href: "/submit", label: "Submit" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/status", label: "Status" }
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Builder Deals Intel",
  url: "https://builderdealintel.com",
  email: "partnerships@builderdealintel.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "business partnerships",
      email: "partnerships@builderdealintel.com",
      availableLanguage: ["en"]
    },
    {
      "@type": "ContactPoint",
      contactType: "editorial corrections",
      email: "editorial@builderdealintel.com",
      availableLanguage: ["en"]
    }
  ],
  sameAs: ["https://builderdealintel.com/contact", "https://builderdealintel.com/media-kit"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          type="application/ld+json"
        />
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">BD</span>
            <span>
              <strong>Builder Deals Intel</strong>
              <small>Signal-ranked tech deals</small>
            </span>
          </Link>
          <nav aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>
            Builder Deals Intel is a source-backed technology deals publication. Contact:{" "}
            <a href="mailto:partnerships@builderdealintel.com">partnerships@builderdealintel.com</a>. Some links may be
            affiliate links.
          </p>
          <div>
            <Link href="/admin">Admin</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/newsletter">Newsletter</Link>
            <Link href="/daily-brief">Daily Brief</Link>
            <Link href="/rss.xml">RSS</Link>
            <Link href="/newsletter/archive">Brief Archive</Link>
            <Link href="/best-ai-deals">AI Deals</Link>
            <Link href="/ai-coding-tool-deals">AI Coding Tools</Link>
            <Link href="/saas-discounts">SaaS Discounts</Link>
            <Link href="/free-cloud-credits">Cloud Credits</Link>
            <Link href="/hosting-deals">Hosting Deals</Link>
            <Link href="/hosting-for-saas-projects">SaaS Hosting</Link>
            <Link href="/ai-agent-hosting">AI Agent Hosting</Link>
            <Link href="/newsletter-tools-for-builders">Newsletter Tools</Link>
            <Link href="/automation-tools-for-ai-workflows">Automation Tools</Link>
            <Link href="/media-kit">Media Kit</Link>
            <Link href="/advertise">Advertise</Link>
            <Link href="/partner-programs">Partner Programs</Link>
            <Link href="/commercial-proof">Commercial Proof</Link>
            <Link href="/status">Status</Link>
            <Link href="/editorial-policy">Editorial Policy</Link>
            <Link href="/affiliate-compliance">Compliance</Link>
            <Link href="/affiliate-disclosure">Disclosure</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
