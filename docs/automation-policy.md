# Automation Policy

The site can operate with low human intervention, but only high-confidence listings should publish automatically.

## Auto-publish

Deals can publish automatically when all of these are true:

- Source is official and confidence is at least 85, or trusted community source and confidence is at least 90.
- No token, crypto, airdrop, price-anomaly, or needs-review risk tag.
- Price, eligibility, source URL, and deal URL are present.
- AI extraction uses only facts from the source page.

## Review required

Deals must enter review when any of these are true:

- User submission.
- Source is open web or unknown.
- Affiliate link is supplied by the submitter.
- Token, points, crypto, or airdrop language appears.
- Deal claims a very large discount without an official source.
- Region, deadline, or eligibility is unclear.

## Daily runs

Recommended cron schedule:

- 08:00 Asia/Shanghai
- 09:00 Europe/London
- 18:00 America/New_York

Run this command for each scheduled job:

```bash
npm run daily:ops
```

The job order is:

1. Expire past-due deals.
2. Ingest monitored sources.
3. Generate the newsletter draft from current published deals.

The newsletter should only include `auto_published` deals with confidence scores of 85 or higher.
