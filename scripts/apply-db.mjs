import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const root = process.cwd();
const schema = await fs.readFile(path.join(root, "db", "schema.sql"), "utf8");
const seed = await fs.readFile(path.join(root, "db", "seed.sql"), "utf8");
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
  await client.query(schema);
  await client.query(seed);
  console.log("Database schema and seed data applied.");
} finally {
  await client.end();
}
