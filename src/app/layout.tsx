import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Builder Deals Intel",
  description: "Daily AI, SaaS, and developer deals intelligence for builders.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://builderdeals.example.com")
};

const navItems = [
  { href: "/", label: "Today" },
  { href: "/categories/ai_tools", label: "AI" },
  { href: "/categories/saas", label: "SaaS" },
  { href: "/categories/developer_tools", label: "Dev Tools" },
  { href: "/free-cloud-credits", label: "Cloud Credits" },
  { href: "/submit", label: "Submit" },
  { href: "/sponsor", label: "Sponsor" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
            Some links may be affiliate links. We prioritize source transparency, eligibility notes, and risk labels over
            paid placement.
          </p>
          <div>
            <Link href="/admin">Admin</Link>
            <Link href="/newsletter">Newsletter</Link>
            <Link href="/best-ai-deals">AI Deals</Link>
            <Link href="/free-cloud-credits">Cloud Credits</Link>
            <Link href="/affiliate-disclosure">Disclosure</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
