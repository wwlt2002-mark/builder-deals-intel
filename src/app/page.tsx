import Link from "next/link";
import { DealCard } from "@/components/DealCard";
import { categories } from "@/lib/categories";
import { getFeaturedDeals, getReviewDeals } from "@/lib/deals";
import { moneyPages } from "@/lib/money-pages";
import { getSiteUrl } from "@/lib/site-url";

export const metadata = {
  title: "Builder Deals Intel",
  description: "Daily AI, SaaS, cloud credit, hosting, and developer tool deals intelligence for builders.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Builder Deals Intel",
    description: "Daily source-backed AI, SaaS, cloud credit, hosting, and developer tool deals for builders.",
    url: "/",
    siteName: "Builder Deals Intel",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Builder Deals Intel",
    description: "Daily source-backed AI, SaaS, cloud, hosting, and developer tool deals for builders."
  }
};

export default async function HomePage() {
  const featuredDeals = await getFeaturedDeals(10);
  const reviewDeals = await getReviewDeals();
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Builder Deals Intel",
      url: getSiteUrl("/").toString(),
      description: metadata.description,
      publisher: {
        "@type": "Organization",
        name: "Builder Deals Intel",
        email: "partnerships@builderdealintel.com"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Today's Best Builder Deals",
      description: metadata.description,
      url: getSiteUrl("/").toString(),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: featuredDeals.map((deal, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: deal.title,
          url: getSiteUrl(`/deals/${deal.slug}`).toString()
        }))
      }
    }
  ];

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Live deal intelligence for builders</span>
          <h1>Today&apos;s best builder deals, filtered for signal.</h1>
          <p>
            Daily AI, SaaS, cloud credit, hosting, and developer tool deals with source links, risk labels, and
            confidence scoring. Built for founders, engineers, and indie builders who do not have time for noisy coupon
            feeds.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/newsletter">
              Get the daily top 10
            </Link>
            <Link className="secondary-button" href="/submit">
              Submit a deal
            </Link>
          </div>
        </div>
        <aside className="signal-console" aria-label="Deal intelligence metrics">
          <div className="console-topline">
            <span>Signal Monitor</span>
            <strong>LIVE</strong>
          </div>
          <div className="signal-map" aria-hidden="true">
            <span className="signal-node node-a" />
            <span className="signal-node node-b" />
            <span className="signal-node node-c" />
            <span className="signal-node node-d" />
            <span className="signal-line line-a" />
            <span className="signal-line line-b" />
            <span className="signal-line line-c" />
          </div>
          <div className="metric-row signal-metrics">
            <div className="metric">
              <strong>{featuredDeals.length}</strong>
              <span>verified live</span>
            </div>
            <div className="metric">
              <strong>{reviewDeals.length}</strong>
              <span>in review</span>
            </div>
            <div className="metric">
              <strong>5</strong>
              <span>buyer categories</span>
            </div>
          </div>
        </aside>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Today&apos;s Best Deals</h2>
            <p>Only high-confidence listings from official or trusted sources appear here.</p>
          </div>
          <Link className="secondary-button" href="/deals">
            View all deals
          </Link>
        </div>
        <div className="deal-grid">
          {featuredDeals.map((deal) => (
            <DealCard deal={deal} key={deal.id} placement="home_featured_card" />
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Browse by category</h2>
            <p>Each category is designed around affiliate-friendly buyer intent.</p>
          </div>
        </div>
        <div className="deal-grid">
          {categories.map((category) => (
            <Link className="panel category-panel" href={`/categories/${category.id}`} key={category.id}>
              <h3>{category.label}</h3>
              <p className="summary">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Buyer guides</h2>
            <p>High-intent pages for readers comparing tools, credits, hosting, and infrastructure before they buy.</p>
          </div>
        </div>
        <div className="deal-grid">
          {moneyPages.slice(0, 6).map((page) => (
            <Link className="panel category-panel" href={`/${page.slug}`} key={page.slug}>
              <h3>{page.title}</h3>
              <p className="summary">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
        type="application/ld+json"
      />
    </div>
  );
}
