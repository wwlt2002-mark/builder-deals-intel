export const metadata = {
  title: "Privacy Policy | Builder Deals Intel",
  description: "How Builder Deals Intel handles submitted emails, sponsor leads, and operational analytics."
};

export default function PrivacyPage() {
  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Privacy</span>
        <h1>Privacy policy.</h1>
        <p>
          Builder Deals Intel collects only the information needed to run deal submissions, sponsor inquiries,
          newsletter signups, and basic outbound click reporting.
        </p>
      </section>

      <section className="legal-grid">
        <div className="panel">
          <h2>What we collect</h2>
          <p className="summary">
            We may store submitted URLs, optional submitter emails, newsletter emails, sponsor lead details, outbound
            deal clicks, referrers, and user-agent strings.
          </p>
        </div>
        <div className="panel">
          <h2>How it is used</h2>
          <p className="summary">
            Data is used to review deals, manage sponsorship requests, send requested updates, measure affiliate
            performance, and improve source quality.
          </p>
        </div>
        <div className="panel">
          <h2>What we do not do</h2>
          <p className="summary">
            We do not sell personal contact details. We do not publish submitter emails or sponsor contact details on
            public deal pages.
          </p>
        </div>
        <div className="panel">
          <h2>Contact and removal</h2>
          <p className="summary">
            If a submitted lead or email should be removed, contact the site operator through the sponsor or submission
            form with enough context to identify the record.
          </p>
        </div>
      </section>
    </div>
  );
}
