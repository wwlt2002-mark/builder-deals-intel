import Link from "next/link";
import { affiliatePrograms, getAffiliateProgramId } from "@/lib/affiliate-programs";
import { getProgramApplicationCopy } from "@/lib/application-copy";
import { getCategoryLabel } from "@/lib/categories";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return affiliatePrograms.map((program) => ({
    program: getAffiliateProgramId(program.name)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ program: string }> }) {
  const { program: programId } = await params;
  const program = affiliatePrograms.find((item) => getAffiliateProgramId(item.name) === programId);

  if (!program) {
    return {
      title: "Affiliate Program Fit | Builder Deals Intel",
      alternates: {
        canonical: "/partner-programs"
      }
    };
  }

  const title = `${program.name} Fit | Builder Deals Intel`;
  const description = `Public affiliate application fit, promotion plan, and compliance notes for ${program.name}.`;
  const canonical = `/partner-programs/${programId}`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Builder Deals Intel",
      type: "website"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

export default async function ProgramFitPage({ params }: { params: Promise<{ program: string }> }) {
  const { program: programId } = await params;
  const program = affiliatePrograms.find((item) => getAffiliateProgramId(item.name) === programId);

  if (!program) {
    notFound();
  }

  const copy = getProgramApplicationCopy(program);

  return (
    <div className="page legal-page">
      <section className="page-title">
        <span className="eyebrow">Affiliate fit profile</span>
        <h1>{program.name} is a fit for Builder Deals Intel.</h1>
        <p>
          This page gives affiliate managers a direct review path: category fit, promotion plan, source discipline,
          payout blockers, and the content surfaces where the offer can be promoted after approval.
        </p>
        <div className="hero-actions">
          <a className="button" href={program.url} rel="noopener noreferrer" target="_blank">
            Program page
          </a>
          <Link className="secondary-button" href="/partner-programs">
            Partner profile
          </Link>
          <Link className="secondary-button" href="/commercial-proof">
            Commercial proof
          </Link>
        </div>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Category</strong>
          <span>{getCategoryLabel(program.category)}</span>
        </div>
        <div>
          <strong>Network</strong>
          <span>{program.network}</span>
        </div>
        <div>
          <strong>Commission</strong>
          <span>{program.commission}</span>
        </div>
        <div>
          <strong>Payout</strong>
          <span>{program.payout}</span>
        </div>
        <div>
          <strong>Application stage</strong>
          <span>{program.application_stage.replace("_", " ")}</span>
        </div>
        <div>
          <strong>Owner blocker</strong>
          <span>{program.owner_blocker}</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Application packet</h2>
            <p>Program-specific answers that keep the application honest and reviewable.</p>
          </div>
        </div>
        <div className="table-panel">
          <div className="admin-table application-copy-table">
            <div className="admin-table-head">Field</div>
            <div className="admin-table-head">Answer</div>
            {copy.map((item) => (
              <div className="admin-table-row" key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                </div>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="policy-grid table-panel">
        <div>
          <strong>Launch asset</strong>
          <span>{program.launch_asset}</span>
        </div>
        <div>
          <strong>Next step</strong>
          <span>{program.next_step}</span>
        </div>
        <div>
          <strong>Source</strong>
          <a href={program.source_url} rel="noopener noreferrer" target="_blank">
            Verify program source
          </a>
        </div>
      </section>
    </div>
  );
}
