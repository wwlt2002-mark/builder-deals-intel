import Link from "next/link";
import { DealCard } from "@/components/DealCard";
import { getCategoryLabel } from "@/lib/categories";
import { getRelatedMoneyPages, type MoneyPage } from "@/lib/money-pages";
import { getSiteUrl } from "@/lib/site-url";
import type { Deal } from "@/lib/types";

export function MoneyPageView({ page, deals }: { page: MoneyPage; deals: Deal[] }) {
  const relatedPages = getRelatedMoneyPages(page);
  const pageUrl = getSiteUrl(`/${page.slug}`).toString();
  const categoryUrl = getSiteUrl(`/categories/${page.category}`).toString();
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: "Builder Deals Intel",
        url: getSiteUrl("/").toString()
      },
      about: page.intent,
      audience: {
        "@type": "Audience",
        audienceType: page.sponsorFit.audience
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getSiteUrl("/").toString()
        },
        {
          "@type": "ListItem",
          position: 2,
          name: getCategoryLabel(page.category),
          item: categoryUrl
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.title,
          item: pageUrl
        }
      ]
    },
    {
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
    }
  ];

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
            <h2>Related buyer guides</h2>
            <p>More high-intent pages that help readers compare adjacent tools and infrastructure.</p>
          </div>
        </div>
        <div className="deal-grid">
          {relatedPages.map((relatedPage) => (
            <Link className="panel category-panel" href={`/${relatedPage.slug}`} key={relatedPage.slug}>
              <h3>{relatedPage.title}</h3>
              <p className="summary">{relatedPage.description}</p>
            </Link>
          ))}
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

      <section className="newsletter-sponsor-band">
        <div>
          <span className="eyebrow">Daily brief</span>
          <h2>Track new deals in this segment.</h2>
          <p className="summary">
            Get the daily builder deals brief with source-backed AI, SaaS, hosting, cloud credit, and developer tool
            offers.
          </p>
        </div>
        <form action="/api/newsletter" className="inline-form" method="post">
          <div aria-hidden="true" className="hp-field">
            <label htmlFor={`${page.slug}-name`}>Name</label>
            <input id={`${page.slug}-name`} name="name" tabIndex={-1} type="text" />
          </div>
          <label className="sr-only" htmlFor={`${page.slug}-email`}>
            Email
          </label>
          <input id={`${page.slug}-email`} name="email" placeholder="you@example.com" required type="email" />
          <button className="button" type="submit">
            Join the brief
          </button>
        </form>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Growth and proof path</h2>
            <p>Use this guide as part of the measurable loop from organic search to subscriber and outbound click data.</p>
          </div>
        </div>
        <div className="deal-grid">
          <Link className="panel category-panel" href="/growth">
            <h3>Public growth plan</h3>
            <p className="summary">See how buyer-intent pages, search paths, daily briefs, and tracked clicks work together.</p>
          </Link>
          <Link className="panel category-panel" href="/commercial-proof">
            <h3>Commercial proof</h3>
            <p className="summary">Review conservative subscriber, click, placement, and sponsor-readiness signals.</p>
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </div>
  );
}
