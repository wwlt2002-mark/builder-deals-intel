import { MoneyPageView } from "@/components/MoneyPageView";
import { getDealsByCategory } from "@/lib/deals";
import { getMoneyPage } from "@/lib/money-pages";

const page = getMoneyPage("automation-tools-for-ai-workflows")!;

export const metadata = {
  title: `${page.title} | Builder Deals Intel`,
  description: page.description
};

export default async function AutomationToolsForAiWorkflowsPage() {
  const deals = await getDealsByCategory(page.category);
  return <MoneyPageView page={page} deals={deals} />;
}
