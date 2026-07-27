import type { Metadata } from "next";
import { DealCard } from "@/components/DealCard";
import { categories } from "@/lib/categories";
import { getPublishedDeals } from "@/lib/deals";
import { growthSearches } from "@/lib/growth";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Builder Deals | Builder Deals Intel",
  description: "All source-backed AI, SaaS, hosting, cloud, developer tool, and monetization deals for builders.",
  alternates: {
    canonical: "/deals"
  }
};

type DealsIndexPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

function matchesDealSearch(deal: Awaited<ReturnType<typeof getPublishedDeals>>[number], query: string) {
  const haystack = [
    deal.title,
    deal.product_name,
    deal.merchant,
    deal.discount_summary,
    deal.ai_summary,
    deal.region,
    deal.category,
    ...deal.risk_tags
  ]
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export default async function DealsIndexPage({ searchParams }: DealsIndexPageProps) {
  const params = searchParams ? await searchParams : {};
  const query = (params.q ?? "").trim();
  const deals = await getPublishedDeals();
  const visibleDeals = query ? deals.filter((deal) => matchesDealSearch(deal, query)) : deals;
  const categoryCounts = categories.map((category) => ({
    ...category,
    count: visibleDeals.filter((deal) => deal.category === category.id).length
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: query ? `Search results for ${query}` : "All Builder Deals",
    description: metadata.description,
    url: getSiteUrl(query ? `/deals?q=${encodeURIComponent(query)}` : "/deals").toString(),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: visibleDeals.slice(0, 50).map((deal, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: deal.title,
        url: getSiteUrl(`/deals/${deal.slug}`).toString()
      }))
    }
  };

  return (
    <div className="page">
      <section className="page-title">
        <span className="eyebrow">Source-backed index</span>
        <h1>All builder deals</h1>
        <p>
          A complete public index of verified AI, SaaS, hosting, cloud, developer tool, newsletter, automation, and
          monetization offers tracked by Builder Deals Intel.
        </p>
      </section>

      <section className="panel search-panel" aria-label="Search deals">
        <form action="/deals" className="inline-form" method="get">
          <label className="sr-only" htmlFor="deal-search">
            Search deals
          </label>
          <input
            defaultValue={query}
            id="deal-search"
            name="q"
            placeholder="Search AI credits, hosting, Postgres, email, auth..."
            type="search"
          />
          <button className="button" type="submit">
            Search
          </button>
          {query ? (
            <a className="secondary-button" href="/deals">
              Clear
            </a>
          ) : null}
        </form>
        <p className="summary">
          {query
            ? `${visibleDeals.length} matching listings for "${query}".`
            : "Search by product, merchant, category, risk tag, region, or deal summary."}
        </p>
        <div className="quick-searches" aria-label="Popular deal searches">
          {growthSearches.slice(0, 6).map((item) => (
            <a href={`/deals?q=${encodeURIComponent(item.query)}`} key={item.query}>
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Coverage</h2>
            <p>
              {visibleDeals.length} {query ? "matching" : "published"} listings, grouped by buyer intent.
            </p>
          </div>
        </div>
        <div className="deal-grid">
          {categoryCounts.map((category) => (
            <a className="panel category-panel" href={`#${category.id}`} key={category.id}>
              <h3>{category.label}</h3>
              <p className="summary">
                {category.count} live listings. {category.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {categories.map((category) => {
        const categoryDeals = visibleDeals.filter((deal) => deal.category === category.id);

        if (!categoryDeals.length) {
          return null;
        }

        return (
          <section id={category.id} key={category.id}>
            <div className="section-head">
              <div>
                <h2>{category.label}</h2>
                <p>{category.description}</p>
              </div>
            </div>
            <div className="deal-grid">
              {categoryDeals.map((deal) => (
                <DealCard deal={deal} key={deal.id} placement={`all_deals_${category.id}_card`} />
              ))}
            </div>
          </section>
        );
      })}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </div>
  );
}
