import { MoneyPageView } from "@/components/MoneyPageView";
import { getDealsByCategory } from "@/lib/deals";
import { getMoneyPage } from "@/lib/money-pages";

const page = getMoneyPage("free-cloud-credits")!;

export const metadata = {
  title: `${page.title} | Builder Deals Intel`,
  description: page.description
};

export default async function FreeCloudCreditsPage() {
  const deals = await getDealsByCategory(page.category);
  return <MoneyPageView page={page} deals={deals} />;
}
