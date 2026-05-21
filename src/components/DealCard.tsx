import Link from "next/link";
import { getCategoryLabel } from "@/lib/categories";
import type { Deal } from "@/lib/types";

export function DealCard({ deal, placement = "deal_card" }: { deal: Deal; placement?: string }) {
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
      <div className="deal-card-actions">
        <a
          className="button"
          href={`/out/${deal.slug}?placement=${encodeURIComponent(placement)}`}
          rel="nofollow sponsored noopener noreferrer"
          target="_blank"
        >
          Open deal
        </a>
        <Link className="secondary-button" href={`/deals/${deal.slug}`}>
          Source and terms
        </Link>
      </div>
    </article>
  );
}
