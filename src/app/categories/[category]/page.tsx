import { notFound } from "next/navigation";
import Link from "next/link";
import { DealCard } from "@/components/DealCard";
import { categories } from "@/lib/categories";
import { getDealsByCategory } from "@/lib/deals";
import { moneyPages } from "@/lib/money-pages";
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

  return {
    title: category ? `${category.label} Deals | Builder Deals Intel` : "Deals | Builder Deals Intel",
    description: category?.description
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
    </div>
  );
}
