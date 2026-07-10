# Santaan Tracking Recovery Handoff

Branches:

- Website: `fix/santaan-tracking-recovery`
- Worker: `fix/santaan-tracking-recovery-worker`

Production was not deployed by this change.

## What Changed

- Website CTA clicks emit `whatsapp_click`, `book_consultation_click`, or `phone_call_click`.
- CTA clicks do not emit `generate_lead`.
- Website forms emit `generate_lead` only after the CRM returns a confirmed `lead_id`.
- Browser and server Meta events use the same `event_id` for deduplication.
- UTMs and `gclid`, `gbraid`, `wbraid`, `fbclid`, `_fbp`, and `_fbc` are preserved where available.
- The Worker website webhook now creates a lead from the submitted payload instead of fabricating a Meta lead ID.
- The Worker starts the Meta CAPI outbox drain after lead creation and also has scheduled retry handling.

## Required URLs

- Website: `https://www.santaan.in`
- CRM API: `https://api.crmai.greybrain.ai`
- Website intent endpoint: `https://api.crmai.greybrain.ai/api/website/intent`
- Website lead endpoint: `https://api.crmai.greybrain.ai/api/webhook/lead`
- GTM: `GTM-P45XTFCS`
- Meta Pixel/Dataset: `9115270055242145`

## Junior Developer QA

1. Open the Vercel preview generated from `fix/santaan-tracking-recovery`.
2. Open DevTools Network and click a WhatsApp, phone, and booking CTA.
3. Confirm each click creates one request to `/api/website/intent`.
4. Confirm the request includes `event_id`, the correct `kind`, UTMs, and available click identifiers.
5. Confirm the click creates a `Contact` event, not `generate_lead`.
6. Submit one clearly marked test form using a test phone number.
7. Confirm the form succeeds only when the response contains `lead_id`.
8. Confirm the test lead appears once in CRM.
9. Confirm the same test lead produces one `Lead` event in Meta Test Events.
10. Confirm the CAPI outbox status becomes `sent`, not `pending` or `failed`.

Do not use a real patient’s name, phone number, email, or medical information for QA.

## Release Gate

Do not merge or deploy until:

- Website build and E2E tests pass.
- Worker TypeScript check passes.
- Meta token validation succeeds.
- Meta Test Events shows one `Contact` and one deduplicated `Lead`.
- CRM lead count and successful website form count match for the QA window.
- Google Ads conversion goals are reviewed and only approved lead events are primary.

After the first 24–48 hours of clean production data, remove `SANTAAN ODISHA` and `Santaan Meta ads` from active campaigns, GTM, CRM routing, and other integrations. Archive them rather than deleting them immediately.

## Useful Checks

```bash
cd worker
bun run typecheck
bunx eslint src/routes/webhook.meta.ts
```

The full Worker lint command currently reports pre-existing errors in unrelated files. Review those separately; do not mix them into this tracking change.

For CAPI health and retry commands, use the [CRM CAPI integration runbook](https://github.com/satishskid/crmai/blob/fix/santaan-tracking-recovery-worker/docs/CAPI_CRM_INTEGRATION_RUNBOOK.md).
