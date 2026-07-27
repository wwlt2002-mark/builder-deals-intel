import type { Metadata } from "next";
import Link from "next/link";
import { distributionAngles, growthChecklist, growthSearches } from "@/lib/growth";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Growth and Traffic Plan | Builder Deals Intel",
  description:
    "Public growth plan for Builder Deals Intel: search pages, newsletter conversion, outbound click tracking, and commercial proof.",
  alternates: {
    canonical: "/growth"
  },
  openGraph: {
    title: "Growth and Traffic Plan | Builder Deals Intel",
    description:
      "How Builder Deals Intel is building organic traffic, newsletter subscribers, outbound click data, and affiliate proof.",
    url: "/growth",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Growth and Traffic Plan | Builder Deals Intel",
    description: "Search, newsletter, outbound click, and commercial proof plan for Builder Deals Intel."
  }
};

export default function GrowthPage() {
  const pageUrl = getSiteUrl("/growth").toString();
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Growth and Traffic Plan",
      description: metadata.description,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: "Builder Deals Intel",
        url: getSiteUrl("/").toString()
      },
      about: ["organic search", "newsletter growth", "outbound click tracking", "affiliate proof"]
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Builder Deals Intel growth searches",
      itemListElement: growthSearches.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: getSiteUrl(`/deals?q=${encodeURIComponent(item.query)}`).toString()
      }))
    }
  ];

  return (
    <div className="page">
      <section className="hero media-hero">
        <div className="hero-copy">
          <span className="eyebrow">Growth system</span>
          <h1>Turn deal pages into search traffic, subscribers, and tracked clicks.</h1>
          <p>
            This page keeps the traffic plan public and conservative: rank buyer-intent pages, convert repeat readers
            into the daily brief, and measure outbound clicks before making strict affiliate claims.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/newsletter">
              Join the daily brief
            </Link>
            <Link className="secondary-button" href="/commercial-proof">
              View proof
            </Link>
          </div>
        </div>
        <aside className="signal-console media-kit">
          <div className="console-topline">
            <span>Traffic Flywheel</span>
            <strong>LIVE</strong>
          </div>
          <div className="growth-stack" aria-label="Growth loop">
            <span>SEO pages</span>
            <span>Searchable deal index</span>
            <span>Daily brief signup</span>
            <span>Tracked outbound clicks</span>
            <span>Commercial proof</span>
          </div>
        </aside>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Search paths to build traffic</h2>
            <p>These internal search pages help readers move from broad intent to tracked deal clicks.</p>
          </div>
        </div>
        <div className="deal-grid">
          {growthSearches.map((item) => (
            <Link className="panel category-panel" href={`/deals?q=${encodeURIComponent(item.query)}`} key={item.query}>
              <h3>{item.label}</h3>
              <p className="summary">{item.intent}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Distribution angles</h2>
            <p>Reusable positioning for newsletters, communities, sponsor outreach, and affiliate applications.</p>
          </div>
        </div>
        <div className="proof-grid">
          {distributionAngles.map((angle) => (
            <article className="panel" key={angle.title}>
              <span className="eyebrow">{angle.channel}</span>
              <h3>{angle.title}</h3>
              <p className="summary">{angle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-sponsor-band">
        <div>
          <span className="eyebrow">Conversion path</span>
          <h2>Readers should leave a signal before they leave the site.</h2>
          <p className="summary">
            Every growth surface points to one of three measurable actions: newsletter signup, tagged outbound click, or
            sponsor/contact request.
          </p>
        </div>
        <div className="hero-actions compact-actions">
          <Link className="button" href="/newsletter">
            Subscribe
          </Link>
          <Link className="secondary-button" href="/sponsor">
            Sponsor desk
          </Link>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Operating checklist</h2>
            <p>The site stays credible by separating growth work from unsupported traffic claims.</p>
          </div>
        </div>
        <div className="policy-grid table-panel">
          {growthChecklist.map((item) => (
            <div key={item}>
              <strong>Next signal</strong>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </div>
  );
}
