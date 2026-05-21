import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin";
import { getCategoryLabel } from "@/lib/categories";
import { getAllDeals } from "@/lib/deals";
import type { DealCategory, DealStatus, SourceType } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const categories: DealCategory[] = ["ai_tools", "saas", "developer_tools", "cloud_credits", "hosting"];
const statuses: DealStatus[] = ["draft", "auto_published", "needs_review", "rejected", "expired"];
const sourceTypes: SourceType[] = ["official", "trusted_community", "open_web", "user_submission"];

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const deal = (await getAllDeals()).find((item) => item.id === id);

  return {
    title: deal ? `Edit ${deal.product_name} | Builder Deals Intel` : "Edit Deal | Builder Deals Intel"
  };
}

export default async function AdminDealEditPage({ params }: Props) {
  await requireAdminPage();

  const { id } = await params;
  const deal = (await getAllDeals()).find((item) => item.id === id);

  if (!deal) {
    notFound();
  }

  return (
    <div className="page">
      <section className="page-title compact-title">
        <Link className="secondary-button" href="/admin">
          Back to admin
        </Link>
        <h1>Edit deal.</h1>
        <p>{deal.title}</p>
      </section>

      <form action={`/api/admin/deals/${deal.id}`} className="panel form-grid admin-edit-form" method="post">
        <input name="action" type="hidden" value="update" />
        <div className="form-columns">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required type="text" defaultValue={deal.title} />
          </div>
          <div className="field">
            <label htmlFor="product_name">Product</label>
            <input id="product_name" name="product_name" required type="text" defaultValue={deal.product_name} />
          </div>
          <div className="field">
            <label htmlFor="merchant">Merchant</label>
            <input id="merchant" name="merchant" required type="text" defaultValue={deal.merchant} />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={deal.category}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={deal.status}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="source_type">Source type</label>
            <select id="source_type" name="source_type" defaultValue={deal.source_type}>
              {sourceTypes.map((sourceType) => (
                <option key={sourceType} value={sourceType}>
                  {sourceType}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="confidence_score">Confidence</label>
            <input
              id="confidence_score"
              max="100"
              min="0"
              name="confidence_score"
              required
              type="number"
              defaultValue={deal.confidence_score}
            />
          </div>
          <div className="field">
            <label htmlFor="region">Region</label>
            <input id="region" name="region" required type="text" defaultValue={deal.region} />
          </div>
          <div className="field">
            <label htmlFor="original_price">Original price</label>
            <input id="original_price" name="original_price" type="text" defaultValue={deal.original_price ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="deal_price">Deal price</label>
            <input id="deal_price" name="deal_price" type="text" defaultValue={deal.deal_price ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="expires_at">Expires at</label>
            <input
              id="expires_at"
              name="expires_at"
              type="datetime-local"
              defaultValue={deal.expires_at ? deal.expires_at.slice(0, 16) : ""}
            />
          </div>
          <div className="field checkbox-field">
            <label htmlFor="is_affiliate">Affiliate link active</label>
            <input id="is_affiliate" name="is_affiliate" type="checkbox" defaultChecked={deal.is_affiliate} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="discount_summary">Discount summary</label>
          <input id="discount_summary" name="discount_summary" required type="text" defaultValue={deal.discount_summary} />
        </div>
        <div className="field">
          <label htmlFor="source_url">Source URL</label>
          <input id="source_url" name="source_url" required type="url" defaultValue={deal.source_url} />
        </div>
        <div className="field">
          <label htmlFor="deal_url">Deal URL</label>
          <input id="deal_url" name="deal_url" required type="url" defaultValue={deal.deal_url} />
        </div>
        <div className="field">
          <label htmlFor="affiliate_url">Affiliate URL</label>
          <input id="affiliate_url" name="affiliate_url" type="url" defaultValue={deal.affiliate_url ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="risk_tags">Risk tags</label>
          <input id="risk_tags" name="risk_tags" type="text" defaultValue={deal.risk_tags.join(", ")} />
        </div>
        <div className="field">
          <label htmlFor="ai_summary">AI summary</label>
          <textarea id="ai_summary" name="ai_summary" required defaultValue={deal.ai_summary} />
        </div>
        <div className="admin-actions inline-actions">
          <button className="button" type="submit">
            Save changes
          </button>
          <Link className="secondary-button" href={`/deals/${deal.slug}`}>
            Public page
          </Link>
        </div>
      </form>
    </div>
  );
}
