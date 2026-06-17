# Santaan Website

This repository is the standalone public website for Santaan.

It is intentionally separated from:

- CRM operations
- voice automation
- WhatsApp vendor workflows
- old mixed deployment history

## What This Repo Is For

- public marketing website
- SEO pages
- Medium-powered content pages
- WhatsApp-first lead capture
- form handoff into AICRM

## What This Repo Is Not For

- CRM dashboard ownership
- call-center workflows
- voice bot operations
- Meta lead processing inside the website

Those systems should stay in AICRM / Cloudflare.

## Deployment Model

Recommended deployment:

- GitHub repo owned by Santaan team
- Vercel project `santaan-web-static-check`
- production branch `compute-light-vercel-test`
- website env vars managed in that Vercel project
- CRM webhook managed by AICRM team

## Main Public Flows

- `Book on WhatsApp`
- `Call Santaan`
- `Know your score`
- `Seminar registration`
- `At-home testing request`
- `Fertility tips on WhatsApp`

## Lead Flow Architecture

The website does not own CRM data.

Public forms post into website route handlers, and those handlers forward leads into AICRM via webhook.

Current forwarder routes:

- `/api/at-home/register`
- `/api/seminar/register`
- `/api/newsletter/subscribe`

The shared webhook helper is:

- [src/lib/aicrm.ts](/Users/spr/santaan%20hope/santaan-website-only/src/lib/aicrm.ts:1)

## Medium Publishing

Medium publishing is preserved.

Writer workflow:

1. publish on Medium
2. GitHub Actions runs `npm run sync:medium-archive` daily at 4:00 PM IST
3. new posts are committed into the static Santaan archive in `src/content/mediumArchiveSeeds.ts`
4. Vercel auto-deploys the production branch after that commit
5. content appears on Santaan URLs for SEO

For urgent posts, run the `Sync Medium Archive` workflow manually from GitHub Actions instead of redeploying by hand.
Writers can expect posts published before 4:00 PM IST to usually appear on Santaan shortly after the sync and Vercel build complete.

Diagnostic content API:

- `/api/blogs`

Main content helper:

- [src/lib/medium.ts](/Users/spr/santaan%20hope/santaan-website-only/src/lib/medium.ts:1)

## Required Env Vars

Use:

- [.env.example](/Users/spr/santaan%20hope/santaan-website-only/.env.example:1)

Do not commit real secrets.

Minimum production set:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `META_PIXEL_ID`
- `AICRM_LEAD_WEBHOOK_URL`

Optional:

- `RSS2JSON_API_KEY` if RSS2JSON rate limits the Medium feed

GitHub Actions should also have repository secret `RSS2JSON_API_KEY` so daily Medium syncs are stable.

Do not add old website/CRM compute secrets such as `TURSO_*`, `BOLNA_*`, `ZOHO_*`, `GROQ_*`, voice webhooks, or cron secrets to this website-only project.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run build
npm run dev
```

## Vercel Setup

1. Use project `santaan-web-static-check`.
2. Keep production branch as `compute-light-vercel-test`.
3. Add only website env vars from `.env.example`.
4. Add the real AICRM webhook URL only when form testing is required.
5. Deploy.
6. Confirm public pages build as static/SSG and `/api/blogs` is not called by normal page browsing.

## Automatic Medium Sync

Daily article publishing does not require daily manual deploys.

- Workflow file: `.github/workflows/sync-medium-archive.yml`
- Production branch updated by workflow: `compute-light-vercel-test`
- Script: `npm run sync:medium-archive`
- Dry run: `npm run sync:medium-archive -- --dry-run`

Important GitHub Actions note: scheduled workflows run from the repository default branch. If `compute-light-vercel-test` is not the default branch, keep this workflow file present on the default branch too, or make `compute-light-vercel-test` the default branch. The workflow still checks out and pushes only `compute-light-vercel-test`.

Suggested writer expectation:

- Publish before `4:00 PM IST` for same-day appearance.
- Website update usually lands shortly after `4:00 PM IST` once GitHub Actions and Vercel finish.
- If a post is published after `4:00 PM IST`, it will appear the next day unless the team runs `Sync Medium Archive` manually.

## Important Files

- [src/app/page.tsx](/Users/spr/santaan%20hope/santaan-website-only/src/app/page.tsx:1)
- [src/app/api/blogs/route.ts](/Users/spr/santaan%20hope/santaan-website-only/src/app/api/blogs/route.ts:1)
- [src/app/api/seminar/register/route.ts](/Users/spr/santaan%20hope/santaan-website-only/src/app/api/seminar/register/route.ts:1)
- [src/app/api/at-home/register/route.ts](/Users/spr/santaan%20hope/santaan-website-only/src/app/api/at-home/register/route.ts:1)
- [src/app/api/newsletter/subscribe/route.ts](/Users/spr/santaan%20hope/santaan-website-only/src/app/api/newsletter/subscribe/route.ts:1)
- [content/patient-reviews/_TEMPLATE.md](/Users/spr/santaan%20hope/santaan-website-only/content/patient-reviews/_TEMPLATE.md:1)
- [docs/PATIENT_REVIEWS_GITHUB_WORKFLOW.md](/Users/spr/santaan%20hope/santaan-website-only/docs/PATIENT_REVIEWS_GITHUB_WORKFLOW.md:1)

## Patient Reviews

Google/Facebook/patient-story content is managed as Markdown files in:

```text
content/patient-reviews/
```

Only files with `status: approved` are published. Set `featured: true` to include a review on the homepage. Full workflow:

- [docs/PATIENT_REVIEWS_GITHUB_WORKFLOW.md](/Users/spr/santaan%20hope/santaan-website-only/docs/PATIENT_REVIEWS_GITHUB_WORKFLOW.md:1)

## Handoff

Use:

- [docs/WEBSITE_TEAM_HANDOFF_2026-05-23.md](/Users/spr/santaan%20hope/santaan-website-only/docs/WEBSITE_TEAM_HANDOFF_2026-05-23.md:1)
- [docs/MEDIUM_TO_SANTAAN_ARCHIVE_WORKFLOW.md](/Users/spr/santaan%20hope/santaan-website-only/docs/MEDIUM_TO_SANTAAN_ARCHIVE_WORKFLOW.md:1)
- [docs/SANTAAN_META_CRM_MOS_SIGNAL_AUDIT_2026-06-17.md](/Users/spr/santaan%20hope/santaan-website-only/docs/SANTAAN_META_CRM_MOS_SIGNAL_AUDIT_2026-06-17.md:1)

For Vercel + CRM webhook setup, these handoff files are the source of truth.
