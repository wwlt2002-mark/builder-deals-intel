# Hostinger Deployment Notes

Live domain:

- `https://builderdealintel.com`

Current hosting:

- Hostinger Node.js Web App
- Deployment source: GitHub repository `wwlt2002-mark/builder-deals-intel`
- Framework preset: Next.js
- Node version: 22.x
- Build command: `npm run build`
- Output directory: `.next`

Required environment variables:

- `NEXT_PUBLIC_SITE_URL=https://builderdealintel.com`
- `ADMIN_SECRET=<strong secret>`

Optional next environment variables:

- `DATABASE_URL=<postgres connection string>`
- `OPENAI_API_KEY=<ai extraction key>`
- `RESEND_API_KEY=<newsletter sending key>`

Redeploy process before GitHub auto-deploy is connected:

1. Zip the project without `node_modules`, `.next`, or `.git`.
2. Go to Hostinger → Websites → `builderdealintel.com` → Deployments.
3. Open Settings and redeploy.
4. Choose Upload new files.
5. Upload the zip file.
6. Save and redeploy.

Recommended next move:

- Connect the project to GitHub so updates deploy from commits instead of manual zip uploads.
