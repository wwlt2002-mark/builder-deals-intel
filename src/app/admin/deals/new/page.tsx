import Link from "next/link";
import { requireAdminPage } from "@/lib/admin";
import { getCategoryLabel } from "@/lib/categories";
import type { DealCategory, DealStatus, SourceType } from "@/lib/types";

export const dynamic = "force-dynamic";

const categories: DealCategory[] = ["ai_tools", "saas", "developer_tools", "cloud_credits", "hosting"];
const statuses: DealStatus[] = ["draft", "auto_published", "needs_review", "rejected", "expired"];
const sourceTypes: SourceType[] = ["official", "trusted_community", "open_web", "user_submission"];

export const metadata = {
  title: "New Deal | Builder Deals Intel"
};

export default async function NewDealPage() {
  await requireAdminPage();

  return (
    <div className="page">
      <section className="page-title compact-title">
        <Link className="secondary-button" href="/admin">
          Back to admin
        </Link>
        <h1>New deal.</h1>
        <p>Create a verified listing from a source, submission, or affiliate offer.</p>
      </section>

      <form action="/api/admin/deals" className="panel form-grid admin-edit-form" method="post">
        <div className="form-columns">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required type="text" />
          </div>
          <div className="field">
            <label htmlFor="product_name">Product</label>
            <input id="product_name" name="product_name" required type="text" />
          </div>
          <div className="field">
            <label htmlFor="merchant">Merchant</label>
            <input id="merchant" name="merchant" required type="text" />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue="saas">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue="needs_review">
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="source_type">Source type</label>
            <select id="source_type" name="source_type" defaultValue="official">
              {sourceTypes.map((sourceType) => (
                <option key={sourceType} value={sourceType}>
                  {sourceType}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="confidence_score">Confidence</label>
            <input id="confidence_score" max="100" min="0" name="confidence_score" required type="number" defaultValue="85" />
          </div>
          <div className="field">
            <label htmlFor="region">Region</label>
            <input id="region" name="region" required type="text" defaultValue="Global" />
          </div>
          <div className="field">
            <label htmlFor="original_price">Original price</label>
            <input id="original_price" name="original_price" type="text" />
          </div>
          <div className="field">
            <label htmlFor="deal_price">Deal price</label>
            <input id="deal_price" name="deal_price" type="text" />
          </div>
          <div className="field">
            <label htmlFor="expires_at">Expires at</label>
            <input id="expires_at" name="expires_at" type="datetime-local" />
          </div>
          <div className="field checkbox-field">
            <label htmlFor="is_affiliate">Affiliate link active</label>
            <input id="is_affiliate" name="is_affiliate" type="checkbox" />
          </div>
          <div className="field">
            <label htmlFor="affiliate_status">Affiliate status</label>
            <select id="affiliate_status" name="affiliate_status" defaultValue="none">
              <option value="none">none</option>
              <option value="applied">applied</option>
              <option value="approved">approved</option>
              <option value="active">active</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="affiliate_network">Affiliate network</label>
            <input id="affiliate_network" name="affiliate_network" type="text" />
          </div>
          <div className="field">
            <label htmlFor="affiliate_program">Affiliate program</label>
            <input id="affiliate_program" name="affiliate_program" type="text" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="discount_summary">Discount summary</label>
          <input id="discount_summary" name="discount_summary" required type="text" />
        </div>
        <div className="field">
          <label htmlFor="source_url">Source URL</label>
          <input id="source_url" name="source_url" required type="url" />
        </div>
        <div className="field">
          <label htmlFor="deal_url">Deal URL</label>
          <input id="deal_url" name="deal_url" required type="url" />
        </div>
        <div className="field">
          <label htmlFor="affiliate_url">Affiliate URL</label>
          <input id="affiliate_url" name="affiliate_url" type="url" />
        </div>
        <div className="field">
          <label htmlFor="affiliate_notes">Affiliate notes</label>
          <textarea id="affiliate_notes" name="affiliate_notes" />
        </div>
        <div className="field">
          <label htmlFor="risk_tags">Risk tags</label>
          <input id="risk_tags" name="risk_tags" type="text" placeholder="usage-limits, eligibility-varies" />
        </div>
        <div className="field">
          <label htmlFor="ai_summary">AI summary</label>
          <textarea id="ai_summary" name="ai_summary" required />
        </div>
        <button className="button" type="submit">
          Create deal
        </button>
      </form>
    </div>
  );
}
