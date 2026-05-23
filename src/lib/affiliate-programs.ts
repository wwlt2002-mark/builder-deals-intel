import programsJson from "../../data/affiliate-programs.json";
import { getPool, hasDatabase } from "./db";
import type { DealCategory } from "./types";

export type AffiliateProgram = {
  name: string;
  category: DealCategory;
  fit: string;
  network: string;
  commission: string;
  payout: string;
  next_step: string;
  application_stage: "ready" | "content_needed" | "watch";
  owner_blocker: string;
  launch_asset: string;
  priority: "high" | "medium" | "low";
  url: string;
  source_url: string;
};

export type AffiliatePipelineStatus = "planned" | "applied" | "approved" | "blocked" | "rejected";

export type AffiliateProgramRecord = AffiliateProgram & {
  id: string;
  pipeline_status: AffiliatePipelineStatus;
  approved_url: string | null;
  notes: string | null;
  updated_at: string | null;
};

export const affiliatePrograms = programsJson as AffiliateProgram[];

export function getAffiliateProgramId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function withDefaults(program: AffiliateProgram): AffiliateProgramRecord {
  return {
    ...program,
    id: getAffiliateProgramId(program.name),
    pipeline_status: "planned",
    approved_url: null,
    notes: null,
    updated_at: null
  };
}

export async function getAffiliatePipeline(): Promise<AffiliateProgramRecord[]> {
  const defaults = affiliatePrograms.map(withDefaults);

  if (!hasDatabase()) {
    return defaults;
  }

  try {
    const result = await getPool().query(
      `select program_id,
              pipeline_status,
              approved_url,
              notes,
              updated_at
       from affiliate_program_applications`
    );
    const rowsById = new Map(result.rows.map((row) => [String(row.program_id), row]));

    return defaults.map((program) => {
      const row = rowsById.get(program.id);

      if (!row) {
        return program;
      }

      return {
        ...program,
        pipeline_status: String(row.pipeline_status) as AffiliatePipelineStatus,
        approved_url: row.approved_url ? String(row.approved_url) : null,
        notes: row.notes ? String(row.notes) : null,
        updated_at: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null
      };
    });
  } catch {
    return defaults;
  }
}

export async function updateAffiliateProgramStatus(input: {
  id: string;
  pipeline_status: AffiliatePipelineStatus;
  approved_url: string | null;
  notes: string | null;
}) {
  if (!hasDatabase()) {
    throw new Error("Database is required to update affiliate program status.");
  }

  const program = affiliatePrograms.find((item) => getAffiliateProgramId(item.name) === input.id);

  if (!program) {
    throw new Error("Unknown affiliate program.");
  }

  await getPool().query(
    `insert into affiliate_program_applications (
       program_id,
       program_name,
       pipeline_status,
       approved_url,
       notes,
       updated_at
     ) values ($1, $2, $3, $4, $5, now())
     on conflict (program_id) do update
     set program_name = excluded.program_name,
         pipeline_status = excluded.pipeline_status,
         approved_url = excluded.approved_url,
         notes = excluded.notes,
         updated_at = now()`,
    [input.id, program.name, input.pipeline_status, input.approved_url, input.notes]
  );
}
