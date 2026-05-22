import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let pg = null;

try {
  pg = require("pg");
} catch {
  pg = null;
}

if (!process.env.DATABASE_URL) {
  console.log("Dry run only. Set DATABASE_URL to expire past-due deals in Postgres.");
  process.exit(0);
}

if (!pg) {
  throw new Error("The pg package is required when DATABASE_URL is set.");
}

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
    `update deals
     set status = 'expired',
         updated_at = now(),
         last_checked_at = now()
     where status in ('draft', 'auto_published', 'needs_review')
       and expires_at is not null
       and expires_at <= now()
     returning slug, title`
  );

  console.log(`Expired ${result.rowCount ?? 0} past-due deals.`);
  for (const row of result.rows) {
    console.log(`- ${row.slug}: ${row.title}`);
  }
} finally {
  await client.end();
}
