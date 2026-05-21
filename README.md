# Builder Deals Intel

Daily AI, SaaS, and developer deals intelligence for builders.

This is the first implementation of the English global affiliate-first deal intelligence site:

- Next.js App Router frontend
- Structured deal model
- Static seed data for launch content
- Postgres schema for production persistence
- AI/automation-ready ingestion and newsletter scripts
- Admin review surface for high-risk or low-confidence deals

## Local setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production checklist

1. Set `NEXT_PUBLIC_SITE_URL`.
2. Create a Postgres database and apply `db/schema.sql`.
3. Add API keys for AI extraction and email delivery.
4. Replace seed data with real ingestion output.
5. Configure cron:
   - Asia morning
   - Europe workday
   - US evening
6. Add affiliate IDs only after each program approval.
7. Set `ADMIN_SECRET`; `/admin` is protected when this variable exists.

## Database mode

The site runs in two modes:

- Without `DATABASE_URL`: reads seed deals from JSON and writes submissions/subscribers to local JSON.
- With `DATABASE_URL`: reads deals and writes submissions/subscribers in Postgres.

Apply the schema and seed data:

```bash
DATABASE_URL="postgres://..." npm run db:apply
```

Health check:

```text
/api/health
```

## Language strategy

The primary site is English for global SEO and affiliate conversion. Chinese content is not part of v1. If needed later, create a separate US Chinese community distribution layer instead of translating the whole product.
