import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryLabel } from "@/lib/categories";
import { getDealBySlug, getDisclosureText } from "@/lib/deals";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal || deal.status !== "auto_published") {
    return {};
  }

  return {
    title: `${deal.title} | Builder Deals Intel`,
    description: deal.ai_summary,
    alternates: {
      canonical: `/deals/${deal.slug}`
    }
  };
}

export default async function DealPage({ params }: Props) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal || deal.status !== "auto_published") {
    notFound();
  }

  return (
    <div className="page">
      <section className="detail-layout">
        <article className="panel">
          <div className="deal-meta">
            <span>{getCategoryLabel(deal.category)}</span>
            <span>{deal.source_type.replace("_", " ")}</span>
            <span className="confidence">{deal.confidence_score}% confidence</span>
          </div>
          <h1>{deal.title}</h1>
          <p className="summary">{deal.ai_summary}</p>
          <div className="price-line">
            <strong>{deal.deal_price ?? "See terms"}</strong>
            <span>{deal.discount_summary}</span>
          </div>
          <div className="tag-row">
            {deal.risk_tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="hero-actions">
            <a
              className="button"
              href={`/out/${deal.slug}?placement=deal_detail_primary`}
              rel="nofollow sponsored noopener noreferrer"
              target="_blank"
            >
              Open deal
            </a>
            <a className="secondary-button" href={deal.source_url} rel="noopener noreferrer" target="_blank">
              Verify source
            </a>
          </div>
        </article>

        <aside className="panel">
          <h2>Deal facts</h2>
          <dl className="fact-list">
            <div>
              <dt>Product</dt>
              <dd>{deal.product_name}</dd>
            </div>
            <div>
              <dt>Merchant</dt>
              <dd>{deal.merchant}</dd>
            </div>
            <div>
              <dt>Original price</dt>
              <dd>{deal.original_price ?? "Not stated"}</dd>
            </div>
            <div>
              <dt>Deal price</dt>
              <dd>{deal.deal_price ?? "Not stated"}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>{deal.region}</dd>
            </div>
            <div>
              <dt>Expires</dt>
              <dd>{deal.expires_at ? new Date(deal.expires_at).toLocaleDateString("en-US") : "Not listed"}</dd>
            </div>
            <div>
              <dt>Last checked</dt>
              <dd>{new Date(deal.last_checked_at).toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt>Disclosure</dt>
              <dd>{getDisclosureText(deal)}</dd>
            </div>
          </dl>
          <p className="summary">
            Found an issue? <Link href="/submit">Submit an update</Link>.
          </p>
        </aside>
      </section>
    </div>
  );
}
