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

Production deployment:

- GitHub repo owned by Santaan team
- Vercel project `santaan-web-static-check`
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

Public forms post into website route handlers, and those handlers forward leads into AICRM. The website never stores lead records.

High-intent forms use the authenticated, idempotent CRM intake contract:

- `/api/at-home/register`
- `/api/seminar/register`

Their server-only helper is `src/lib/aicrm-website-intake.ts`. It preserves UTM and click markers, supplies one stable submission ID across retries, and acknowledges success only after CRM returns a durable lead ID. CRM owns lead persistence and Meta CAPI delivery.

Newsletter capture remains on the existing generic helper because it is not an urgent counselor lead:

- `/api/newsletter/subscribe`

Its helper is:

- [src/lib/aicrm.ts](/Users/spr/santaan%20hope/santaan-website-only/src/lib/aicrm.ts:1)

## Medium Publishing

Medium publishing is preserved.

Writer workflow:

1. publish on Medium
2. website pulls feed through RSS2JSON
3. content appears on website insight pages

Main content API:

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
- `AICRM_WEBSITE_INTAKE_URL`
- `AICRM_WEBSITE_INTAKE_SECRET` (server-only; never prefix with `NEXT_PUBLIC_`)

Optional:

- `RSS2JSON_API_KEY` if RSS2JSON rate limits the Medium feed
- `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` only if you want a website-side Medium cache

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run build
npm run dev
```

## Vercel Setup

1. Link the existing `santaan-web-static-check` project
2. Add the website env vars from `.env.example`
3. Add the authenticated AICRM intake URL and secret to Preview first
4. Run `npm run test:intake`, `npm run lint`, and `npm run build`
5. Deploy and prove the preview form handoff before adding the same values to Production
6. Promote only the verified build; do not deploy a replacement repository with a smaller route surface

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

For Netlify + CRM webhook setup, that handoff file is the source of truth.
