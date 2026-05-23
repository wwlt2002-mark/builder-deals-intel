# Automation Policy

The site can operate with low human intervention, but only high-confidence listings should publish automatically.

## Auto-publish

Deals can publish automatically when all of these are true:

- Source is official and confidence is at least 85, or trusted community source and confidence is at least 90.
- No token, crypto, airdrop, price-anomaly, or needs-review risk tag.
- Price, eligibility, source URL, and deal URL are present.
- AI extraction uses only facts from the source page.
- Generic monitored-source placeholders must stay in review until a specific offer has been extracted and verified.

## Review required

Deals must enter review when any of these are true:

- User submission.
- Source is open web or unknown.
- Affiliate link is supplied by the submitter.
- Token, points, crypto, or airdrop language appears.
- Deal claims a very large discount without an official source.
- Region, deadline, or eligibility is unclear.

## Owner interruption rules

Only interrupt the owner for:

- Password, account login, email verification, or CAPTCHA.
- Payment, purchase, invoice, payout, bank, tax, or identity details.
- OpenAI, Resend, analytics, affiliate, or other production API keys.
- Final approval for paid sponsor publication or legal/compliance complaints.

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

## Production smoke check

Run this after deploys or major content changes:

```bash
npm run smoke
```

The check verifies the homepage, sponsor page, public status page, money pages, RSS feed, JSON feed, robots.txt, and health endpoint.

When the GitHub token has workflow scope, schedule the same smoke check three times per day and after production
deploys.

## Newsletter sending

Generate a draft first:

```bash
npm run newsletter
```

Send through Resend only after `RESEND_API_KEY`, `DATABASE_URL`, and `NEWSLETTER_FROM_EMAIL` are configured:

```bash
npm run newsletter:send
```

If `RESEND_API_KEY` is missing, the send script exits as a dry run and does not contact subscribers.
