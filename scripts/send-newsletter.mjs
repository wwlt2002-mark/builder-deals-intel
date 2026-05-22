import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
let pg = null;

try {
  pg = require("pg");
} catch {
  pg = null;
}

const root = process.cwd();
const draftPath = path.join(root, "data", "newsletter-draft.md");
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || "Builder Deals Intel <brief@builderdealintel.com>";
const subject = process.env.NEWSLETTER_SUBJECT || "Top 10 Deals for Builders";

if (!resendApiKey) {
  console.log("Dry run only. Set RESEND_API_KEY to send the newsletter through Resend.");
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to load subscribers.");
}

if (!pg) {
  throw new Error("The pg package is required when DATABASE_URL is set.");
}

function markdownToText(markdown) {
  return markdown
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1: $2")
    .trim();
}

function markdownToHtml(markdown) {
  const lines = markdown.split("\n");
  const html = lines
    .map((line) => {
      if (line.startsWith("## ")) {
        return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      }
      if (line.startsWith("# ")) {
        return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      }
      if (line.startsWith("- ")) {
        return `<p>${escapeHtml(line)}</p>`;
      }
      if (!line.trim()) {
        return "";
      }
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("\n");

  return `<div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#101613">${html}</div>`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getSubscribers() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost")
      ? false
      : {
          rejectUnauthorized: false
        }
  });

  await client.connect();
  try {
    const result = await client.query(
      `select email
       from subscribers
       where status = 'active'
       order by created_at asc
       limit 1000`
    );
    return result.rows.map((row) => String(row.email));
  } finally {
    await client.end();
  }
}

async function sendEmail(email, html, text) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed for ${email}: ${response.status} ${body}`);
  }
}

const draft = await fs.readFile(draftPath, "utf8");
const subscribers = await getSubscribers();
const html = markdownToHtml(draft);
const text = markdownToText(draft);

if (!subscribers.length) {
  console.log("No active subscribers to send.");
  process.exit(0);
}

for (const email of subscribers) {
  await sendEmail(email, html, text);
}

console.log(`Sent newsletter to ${subscribers.length} subscribers.`);
