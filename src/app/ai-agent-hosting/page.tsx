import { MoneyPageView } from "@/components/MoneyPageView";
import { getDealsByCategory } from "@/lib/deals";
import { getMoneyPage, getMoneyPageMetadata } from "@/lib/money-pages";

const page = getMoneyPage("ai-agent-hosting")!;

export const metadata = getMoneyPageMetadata(page);

export default async function AiAgentHostingPage() {
  const deals = await getDealsByCategory(page.category);
  return <MoneyPageView page={page} deals={deals} />;
}
