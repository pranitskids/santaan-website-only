# Medium To Santaan Archive Workflow

Santaan should use Medium as the writer-friendly publishing input, but Google should index Santaan URLs as the main content archive.

## Current Architecture

- Writers publish on `https://medium.com/@santaanIVF`.
- The website reads Medium through RSS2JSON in `src/lib/medium.ts`.
- Posts are merged with `src/content/mediumArchiveSeeds.ts` and `src/content/legacyBlogSeeds.ts`.
- Patient articles render under `/fertility-insights/[slug]`.
- Doctor/clinical articles render under `/clinical-insights/[slug]`.
- `/api/blogs` is diagnostic/cached only. Normal homepage and insight browsing should not fetch it in the browser.

## Difference From SKIDS

The local SKIDS website found on this machine uses a published-blog API route backed by an AWS endpoint. That is fine for SKIDS, but it is not the model we want for Santaan because Santaan's goal is low Vercel function compute.

Santaan's safer model is:

1. Medium stays easy for non-technical writers.
2. Santaan keeps a static archive for SEO and reliability.
3. RSS2JSON is used at build/redeploy time for freshness.
4. Public pages remain static/cacheable.

## When A New Medium Article Is Published

1. Publish the Medium article with the correct audience tag.
2. Use `audience-patient` for patient-facing articles.
3. Use `audience-doctor` or `doctor-insights` for clinical articles.
4. Add topic tags such as `ivf-cost`, `pcos`, `male-infertility`, `iui`, or `egg-freezing`.
5. Redeploy the Vercel project so the feed is fetched during build.
6. Open `/fertility-insights` or `/clinical-insights` and confirm the post appears.
7. If RSS2JSON rate limits or Medium returns only a small feed, export the RSS2JSON result and update `src/content/mediumArchiveSeeds.ts`.

## Canonical And Link Rules

- Prefer Santaan internal links inside Medium posts, for example `https://www.santaan.in/ivf-cost-in-india-2026`.
- Do not link to `ivf.santaan.in`, `santaanivf.in`, or old campaign domains from new articles.
- Old archived article HTML is normalized at render time in `src/lib/medium.ts` to replace old Santaan links and outdated phone CTAs.
- Primary website CTAs remain WhatsApp `+91 96689 04011` and call `+91 80 6548 1541`.

## Manual Archive Update Checklist

Use this only when the feed is not enough.

1. Download the RSS2JSON result for `https://medium.com/feed/@santaanIVF`.
2. Convert each item into the shape used by `src/content/mediumArchiveSeeds.ts`.
3. Keep `slug`, `title`, `excerpt`, `html`, `publishedAt`, `author`, `thumbnail`, `tags`, `sourceUrl`, `type`, and `readMinutes`.
4. Confirm patient articles have `type: "blog"` and doctor articles have `type: "doctor"`.
5. Run `npm run lint`.
6. Run `npm run build`.
7. Confirm `/fertility-insights`, `/clinical-insights`, and representative article URLs work.

## Guardrail

Do not reintroduce Turso, CRM tables, voice webhooks, cron jobs, or live page-view blog APIs for the public website. The clean Vercel project should remain a website-first deployment.
