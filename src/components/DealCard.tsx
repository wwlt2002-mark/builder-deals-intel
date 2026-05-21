import Link from "next/link";
import { getCategoryLabel } from "@/lib/categories";
import type { Deal } from "@/lib/types";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="deal-card">
      <div className="deal-meta">
        <span>{getCategoryLabel(deal.category)}</span>
        <span>{deal.source_type.replace("_", " ")}</span>
        <span className="confidence">{deal.confidence_score}% confidence</span>
      </div>
      <div>
        <h3>
          <Link href={`/deals/${deal.slug}`}>{deal.title}</Link>
        </h3>
        <p className="summary">{deal.ai_summary}</p>
      </div>
      <div className="price-line">
        <strong>{deal.deal_price ?? "See terms"}</strong>
        <span>{deal.discount_summary}</span>
      </div>
      <div className="source-strip">
        <span />
        <span />
        <span />
      </div>
      <div className="tag-row">
        {deal.risk_tags.slice(0, 4).map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <Link className="secondary-button" href={`/deals/${deal.slug}`}>
        View source and terms
      </Link>
    </article>
  );
}
