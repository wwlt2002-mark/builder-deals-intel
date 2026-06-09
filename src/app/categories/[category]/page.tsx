import { notFound } from "next/navigation";
import Link from "next/link";
import { DealCard } from "@/components/DealCard";
import { categories } from "@/lib/categories";
import { getDealsByCategory } from "@/lib/deals";
import { moneyPages } from "@/lib/money-pages";
import { getSiteUrl } from "@/lib/site-url";
import type { DealCategory } from "@/lib/types";

type Props = {
  params: Promise<{ category: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: Props) {
  const { category: categoryId } = await params;
  const category = categories.find((item) => item.id === categoryId);
  const title = category ? `${category.label} Deals | Builder Deals Intel` : "Deals | Builder Deals Intel";
  const description = category?.description ?? "Source-backed AI, SaaS, hosting, cloud, and developer tool deals.";
  const canonical = category ? `/categories/${category.id}` : "/deals";

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Builder Deals Intel",
      type: "website"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categoryId } = await params;
  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    notFound();
  }

  const deals = await getDealsByCategory(category.id as DealCategory);
  const buyerGuides = moneyPages.filter((page) => page.category === category.id);
  const pageUrl = getSiteUrl(`/categories/${category.id}`).toString();
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category.label} Deals`,
      description: category.description,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: "Builder Deals Intel",
        url: getSiteUrl("/").toString()
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: deals.slice(0, 10).map((deal, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: deal.title,
          url: getSiteUrl(`/deals/${deal.slug}`).toString()
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getSiteUrl("/").toString()
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.label,
          item: pageUrl
        }
      ]
    }
  ];

  return (
    <div className="page">
      <section className="page-title">
        <h1>{category.label}</h1>
        <p>{category.description}</p>
      </section>

      {buyerGuides.length ? (
        <section>
          <div className="section-head">
            <div>
              <h2>{category.label} buyer guides</h2>
              <p>High-intent guides for readers comparing options before they click out.</p>
            </div>
          </div>
          <div className="deal-grid">
            {buyerGuides.map((page) => (
              <Link className="panel category-panel" href={`/${page.slug}`} key={page.slug}>
                <h3>{page.title}</h3>
                <p className="summary">{page.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="deal-grid">
        {deals.map((deal) => (
          <DealCard deal={deal} key={deal.id} placement={`category_${category.id}_card`} />
        ))}
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
