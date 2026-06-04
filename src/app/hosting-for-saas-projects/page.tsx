import { MoneyPageView } from "@/components/MoneyPageView";
import { getDealsByCategory } from "@/lib/deals";
import { getMoneyPage, getMoneyPageMetadata } from "@/lib/money-pages";

const page = getMoneyPage("hosting-for-saas-projects")!;

export const metadata = getMoneyPageMetadata(page);

export default async function HostingForSaasProjectsPage() {
  const deals = await getDealsByCategory(page.category);
  return <MoneyPageView page={page} deals={deals} />;
}
