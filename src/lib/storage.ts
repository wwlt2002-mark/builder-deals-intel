import fs from "node:fs/promises";
import path from "node:path";
import { getPool, hasDatabase } from "./db";

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
