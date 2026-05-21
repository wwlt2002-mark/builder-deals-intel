import Link from "next/link";
import { DealCard } from "@/components/DealCard";
import { getCategoryLabel } from "@/lib/categories";
import type { MoneyPage } from "@/lib/money-pages";
import type { Deal } from "@/lib/types";

export function MoneyPageView({ page, deals }: { page: MoneyPage; deals: Deal[] }) {
  return (
    <div className="page">
      <section className="hero media-hero">
        <div className="hero-copy">
          <span className="eyebrow">Buyer-intent guide</span>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="hero-actions">
            <Link className="button" href="/newsletter">
              Get daily deals
            </Link>
            <Link className="secondary-button" href={`/categories/${page.category}`}>
              Browse {getCategoryLabel(page.category)}
            </Link>
          </div>
        </div>
        <aside className="signal-console media-kit">
          <div className="console-topline">
            <span>Intent Map</span>
            <strong>SEO</strong>
          </div>
          <div className="tag-row dark-tags">
            {page.intent.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
          <p>Built for high-intent readers who are actively comparing tools, credits, and subscriptions.</p>
        </aside>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Verified offers</h2>
            <p>Deals below are source-labeled and filtered by confidence score.</p>
          </div>
        </div>
        <div className="deal-grid">
          {deals.length ? (
            deals.map((deal) => <DealCard deal={deal} key={deal.id} placement={`${page.slug}_card`} />)
          ) : (
            <div className="panel">
              <p className="summary">No verified offers are live in this segment yet.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>How we evaluate these deals</h2>
            <p>Commercial value matters, but trust keeps the site worth revisiting.</p>
          </div>
        </div>
        <div className="policy-grid table-panel">
          {page.evaluation.map((rule) => (
            <div key={rule}>
              <strong>Rule</strong>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Partner fit</h2>
            <p>Why this page can convert for relevant sponsors and affiliate programs.</p>
          </div>
        </div>
        <div className="policy-grid table-panel">
          <div>
            <strong>Audience</strong>
            <span>{page.sponsorFit.audience}</span>
          </div>
          <div>
            <strong>Best package</strong>
            <span>{page.sponsorFit.package}</span>
          </div>
          <div>
            <strong>Buyer path</strong>
            <span>{page.sponsorFit.buyerPath}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Questions builders ask</h2>
            <p>Short answers for readers comparing offers before they click out.</p>
          </div>
        </div>
        <div className="faq-grid">
          {page.faqs.map((faq) => (
            <article className="panel" key={faq.question}>
              <h3>{faq.question}</h3>
              <p className="summary">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
}
