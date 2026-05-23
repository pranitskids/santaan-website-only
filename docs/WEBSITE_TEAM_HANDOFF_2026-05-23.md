# Website Team Handoff

Date: 2026-05-23

## Goal

This repo is the clean public website repo for Santaan.

Use this repo for:

- website design and content
- SEO
- landing pages
- WhatsApp-first lead capture
- Netlify deployment

Do not use this repo as the CRM system.

## Recommended Ownership

- GitHub repo shared with Santaan team
- Netlify project created fresh from this repo
- CRM stays in AICRM on Cloudflare

## Deployment Branch

Use the main branch of this fresh repo for website deployment.

Do not reuse the old mixed `santaan-web` Netlify project if it creates confusion.

## Required Netlify Env Vars

Set these in Netlify:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `NEXT_PUBLIC_GTM_ID`
- `GOOGLE_ANALYTICS_ID` or `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `META_PIXEL_ID`
- `RSS2JSON_API_KEY`
- `AICRM_LEAD_WEBHOOK_URL`

Optional:

- `AICRM_LEAD_WEBHOOK_TOKEN`
- `NEXT_PUBLIC_PRACTO_WIDGET_ID`
- `NEXT_PUBLIC_PRACTO_BOOKING_URL`
- `NEXT_PUBLIC_PRACTO_DOCTOR_LABEL`
- `NEXT_PUBLIC_PRACTO_LOCATION_LABEL`

Use:

- [.env.example](/Users/spr/santaan%20hope/santaan-website-only/.env.example:1)

## CRM Webhook Requirement

Ask the AICRM owner for:

1. final public webhook URL
2. whether bearer token auth is required
3. token value if required
4. confirmation that the webhook accepts:

```json
{
  "name": "Patient Name",
  "phone": "+919999999999",
  "answers": {
    "source": "website_test",
    "campaign": "TEST",
    "topic": "webhook_test",
    "preferred_channel": "whatsapp"
  }
}
```

The website helper sends this payload shape through:

- [src/lib/aicrm.ts](/Users/spr/santaan%20hope/santaan-website-only/src/lib/aicrm.ts:1)

## Netlify Setup Steps

1. Create a new Netlify site from this repo.
2. Add env vars from `env.website.example`.
3. Add the real CRM webhook URL.
4. Add webhook token only if CRM requires it.
5. Deploy preview.
6. Verify forms and content.
7. Only then attach the final production domain.

## Preview QA Checklist

Check:

- homepage loads
- `fertility-guides` loads
- `fertility-conditions` loads
- `know-your-score` loads
- `fertility-tips` loads
- `fertility-insights` loads
- `clinical-insights` loads
- `/api/blogs` returns Medium-backed posts
- seminar form reaches CRM
- at-home form reaches CRM
- WhatsApp tips form reaches CRM
- GTM loads
- Meta pixel loads
- canonical URL is correct

## CTA Standard

Use these public CTA defaults:

- Call: `+91 80 6548 1541`
- WhatsApp: `+91 96689 04011`

## Final Go-Live Rule

Do not point the real domain until:

- preview is stable
- CRM webhook is confirmed
- Medium feed is working
- CTA numbers are confirmed
- SEO tags are checked
