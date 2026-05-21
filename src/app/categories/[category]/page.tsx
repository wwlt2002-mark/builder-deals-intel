import { notFound } from "next/navigation";
import { DealCard } from "@/components/DealCard";
import { categories } from "@/lib/categories";
import { getDealsByCategory } from "@/lib/deals";
import type { DealCategory } from "@/lib/types";

type Props = {
  params: Promise<{ category: string }>;
};

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

  return (
    <div className="page">
      <section className="page-title">
        <h1>{category.label}</h1>
        <p>{category.description}</p>
      </section>
      <section className="deal-grid">
        {deals.map((deal) => (
          <DealCard deal={deal} key={deal.id} />
        ))}
      </section>
    </div>
  );
}
