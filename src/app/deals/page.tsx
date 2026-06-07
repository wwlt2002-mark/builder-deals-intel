import type { Metadata } from "next";
import { DealCard } from "@/components/DealCard";
import { categories } from "@/lib/categories";
import { getPublishedDeals } from "@/lib/deals";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Builder Deals | Builder Deals Intel",
  description: "All source-backed AI, SaaS, hosting, cloud, developer tool, and monetization deals for builders.",
  alternates: {
    canonical: "/deals"
  }
};

export default async function DealsIndexPage() {
  const deals = await getPublishedDeals();
  const categoryCounts = categories.map((category) => ({
    ...category,
    count: deals.filter((deal) => deal.category === category.id).length
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Builder Deals",
    description: metadata.description,
    url: getSiteUrl("/deals").toString(),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: deals.slice(0, 50).map((deal, index) => ({
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

      <section>
        <div className="section-head">
          <div>
            <h2>Coverage</h2>
            <p>{deals.length} published listings, grouped by buyer intent.</p>
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
        const categoryDeals = deals.filter((deal) => deal.category === category.id);

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
