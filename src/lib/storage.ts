import fs from "node:fs/promises";
import path from "node:path";
import { getPool, hasDatabase } from "./db";
import type { SponsorLead, Submission } from "./types";

const root = process.cwd();

async function readJsonFile<T>(relativePath: string, fallback: T): Promise<T> {
  try {
    const file = await fs.readFile(path.join(root, relativePath), "utf8");
    return JSON.parse(file) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(relativePath: string, value: T) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

export type SubmissionRecord = {
  id: string;
  submitted_url: string;
  submitter_email: string | null;
  relationship: string;
  submitter_note: string | null;
  status: "queued";
  created_at: string;
};

export type SubscriberRecord = {
  id: string;
  email: string;
  source: string;
  created_at: string;
};

export type SponsorLeadRecord = {
  id: string;
  company: string;
  contact_name: string | null;
  email: string;
  website: string | null;
  offer_type: string;
  budget: string | null;
  message: string | null;
  status: "new";
  created_at: string;
};

export async function appendSubmission(record: SubmissionRecord) {
  if (hasDatabase()) {
    await getPool().query(
      `insert into submissions (id, submitted_url, submitter_email, relationship, submitter_note, status, created_at)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        record.id,
        record.submitted_url,
        record.submitter_email,
        record.relationship,
        record.submitter_note,
        record.status,
        record.created_at
      ]
    );
    return;
  }

  const submissions = await readJsonFile<SubmissionRecord[]>("data/submissions.json", []);
  submissions.unshift(record);
  await writeJsonFile("data/submissions.json", submissions);
}

export async function appendSubscriber(record: SubscriberRecord) {
  if (hasDatabase()) {
    await getPool().query(
      `insert into subscribers (id, email, source, created_at)
       values ($1, $2, $3, $4)
       on conflict (email) do nothing`,
      [record.id, record.email, record.source, record.created_at]
    );
    return;
  }

  const subscribers = await readJsonFile<SubscriberRecord[]>("data/subscribers.json", []);
  if (!subscribers.some((subscriber) => subscriber.email.toLowerCase() === record.email.toLowerCase())) {
    subscribers.unshift(record);
    await writeJsonFile("data/subscribers.json", subscribers);
  }
}

export async function getSubscriberStats() {
  if (hasDatabase()) {
    const result = await getPool().query(
      `select
         count(*)::int as total,
         count(*) filter (where created_at >= now() - interval '7 days')::int as last7d
       from subscribers`
    );

    return {
      total: Number(result.rows[0]?.total ?? 0),
      last7d: Number(result.rows[0]?.last7d ?? 0)
    };
  }

  const subscribers = await readJsonFile<SubscriberRecord[]>("data/subscribers.json", []);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    total: subscribers.length,
    last7d: subscribers.filter((subscriber) => new Date(subscriber.created_at).getTime() >= sevenDaysAgo).length
  };
}

export async function getSubmissions(limit = 50): Promise<Submission[]> {
  if (hasDatabase()) {
    const result = await getPool().query(
      `select id,
              submitted_url,
              submitter_email,
              relationship,
              submitter_note,
              generated_deal_id,
              status,
              created_at
       from submissions
       order by created_at desc
       limit $1`,
      [limit]
    );

    return result.rows.map((row) => ({
      id: String(row.id),
      submitted_url: String(row.submitted_url),
      submitter_email: row.submitter_email ? String(row.submitter_email) : null,
      relationship: String(row.relationship ?? "reader"),
      submitter_note: row.submitter_note ? String(row.submitter_note) : null,
      generated_deal_id: row.generated_deal_id ? String(row.generated_deal_id) : null,
      status: String(row.status),
      created_at: new Date(String(row.created_at)).toISOString()
    }));
  }

  return readJsonFile<Submission[]>("data/submissions.json", []);
}

export async function updateSubmissionStatus(id: string, status: string) {
  if (!hasDatabase()) {
    throw new Error("Database is required to update submissions.");
  }

  await getPool().query("update submissions set status = $2 where id = $1", [id, status]);
}

export async function appendSponsorLead(record: SponsorLeadRecord) {
  if (hasDatabase()) {
    await getPool().query(
      `insert into sponsor_leads (
         id,
         company,
         contact_name,
         email,
         website,
         offer_type,
         budget,
         message,
         status,
         created_at
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        record.id,
        record.company,
        record.contact_name,
        record.email,
        record.website,
        record.offer_type,
        record.budget,
        record.message,
        record.status,
        record.created_at
      ]
    );
    return;
  }

  const leads = await readJsonFile<SponsorLeadRecord[]>("data/sponsor-leads.json", []);
  leads.unshift(record);
  await writeJsonFile("data/sponsor-leads.json", leads);
}

export async function getSponsorLeads(limit = 50): Promise<SponsorLead[]> {
  if (hasDatabase()) {
    const result = await getPool().query(
      `select id,
              company,
              contact_name,
              email,
              website,
              offer_type,
              budget,
              message,
              status,
              created_at
       from sponsor_leads
       order by created_at desc
       limit $1`,
      [limit]
    );

    return result.rows.map((row) => ({
      id: String(row.id),
      company: String(row.company),
      contact_name: row.contact_name ? String(row.contact_name) : null,
      email: String(row.email),
      website: row.website ? String(row.website) : null,
      offer_type: String(row.offer_type),
      budget: row.budget ? String(row.budget) : null,
      message: row.message ? String(row.message) : null,
      status: String(row.status),
      created_at: new Date(String(row.created_at)).toISOString()
    }));
  }

  return readJsonFile<SponsorLead[]>("data/sponsor-leads.json", []);
}

export async function updateSponsorLeadStatus(id: string, status: string) {
  if (!hasDatabase()) {
    throw new Error("Database is required to update sponsor leads.");
  }

  await getPool().query("update sponsor_leads set status = $2 where id = $1", [id, status]);
}
