export const metadata = {
  title: "Submit a Deal | Builder Deals Intel",
  description: "Submit AI, SaaS, cloud, hosting, or developer tool deals for AI-assisted review."
};

export default function SubmitPage({
  searchParams
}: {
  searchParams?: Promise<{ queued?: string }>;
}) {
  return (
    <div className="page">
      <section className="page-title">
        <h1>Submit a builder deal.</h1>
        <p>
          Add a source URL and any context you have. AI will extract the deal facts, but user submissions always enter
          the review queue before publishing.
        </p>
      </section>
      <form action="/api/submit" className="panel form-grid" method="post">
        {searchParams ? <SubmitNotice searchParams={searchParams} /> : null}
        <div className="field">
          <label htmlFor="url">Source or deal URL</label>
          <input id="url" name="url" placeholder="https://example.com/promo" type="url" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="you@example.com" type="email" />
        </div>
        <div className="field">
          <label htmlFor="relationship">Relationship to merchant</label>
          <select id="relationship" name="relationship">
            <option>I am not affiliated with this merchant</option>
            <option>I work with or for this merchant</option>
            <option>I may receive a referral or affiliate benefit</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="note">What makes this worth checking?</label>
          <textarea id="note" name="note" placeholder="Price, deadline, eligibility, region, coupon code, or catch." />
        </div>
        <button className="button" type="submit">
          Queue for AI review
        </button>
      </form>
    </div>
  );
}

async function SubmitNotice({ searchParams }: { searchParams: Promise<{ queued?: string }> }) {
  const params = await searchParams;

  if (params.queued !== "1") {
    return null;
  }

  return <p className="summary">Thanks. The link is queued for AI extraction and review.</p>;
}
