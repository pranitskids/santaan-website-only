# Santaan Meta Campaign Optimisation Plan

Last updated: 2026-06-17

Purpose: make Santaan's Meta campaign suite cleaner, more efficient, and conversion-focused without disturbing live patient lead flow.

## Executive Goal

Santaan should use Meta for qualified fertility enquiries across Bhubaneswar, Berhampur, Angul, and nearby Odisha catchments. The campaign system should optimise for real patient intent, not just cheap clicks or disconnected form fills.

Primary conversion actions:

- WhatsApp enquiry to `+91 96689 04011`
- Call enquiry to `+91 80 6548 1541`
- Book consultation intent
- CRM-qualified lead or appointment booked, once AICRM feedback is connected

Do not optimise for Bangalore clinic leads because Bangalore is R&D only.

## Current Account Observations

Business portfolio: Santaan IVF.

Primary live ad account:

- `SANTAAN - ODISHA`
- This is the active spending account and should remain the focus.
- Multiple live campaigns exist with mixed objectives: calls, messages, forms, engagement/drafts.
- Some campaigns are efficient on call cost; some form/message campaigns are expensive.

Secondary/legacy account:

- `Santaan - BNG`
- Mostly inactive or old test campaigns.
- Keep inactive unless a future non-clinic R&D campaign is intentionally planned.

Legacy/no-longer-needed area:

- `SAI SCAN`
- Treat as legacy. Do not delete immediately, but remove it from active planning and review partner/user access later.

Tracking status after 2026-06-17 audit:

- Primary tracking asset is `santaan` Meta Pixel / dataset ID `9115270055242145`.
- It is connected to the live `SANTAAN - ODISHA` ad account.
- The old `SANTAAN ODISHA` and `Santaan Meta ads` datasets show no data connected and should not be used for campaign optimisation.
- Production Vercel `META_PIXEL_ID` was corrected from a masked placeholder value to the live numeric pixel ID, then redeployed.
- Events Manager still shows browser Pixel only; Conversions API is not yet connected.
- Current custom conversion `Final Lead - Bud` is too broad because it counts URL traffic where URL contains `www.santaan.in`; do not optimise campaigns against it.

Lead/call leak audit:

- Latest MOS import for week starting `2026-06-15` shows several campaigns spending with high impressions/clicks but weak lead/call action output.
- This means the current problem is not only tracking; some campaigns likely leak at delivery, CTA handoff, Vobiz routing, WhatsApp routing, or message-match.
- Use [META_LEAD_CALL_LEAK_AUDIT_2026-06-17.md](/Users/spr/santaan%20hope/santaan-website-only/docs/META_LEAD_CALL_LEAK_AUDIT_2026-06-17.md:1) before scaling or pausing any campaign.

## Safety Guardrails

- Do not publish, discard, pause, or delete live campaigns without founder approval.
- Do not delete legacy assets immediately; archive or disconnect only after checking dependencies.
- Do not use health-condition language that directly implies the viewer has a medical condition.
- Do not send sensitive diagnosis-level website events to Meta. Keep events generic: `Lead`, `Contact`, `Schedule`, `ViewContent`.
- Do not duplicate all old website/CRM tracking. The website is now compute-light; CRM qualification should happen in AICRM.

Relevant Meta references:

- Meta datasets: https://www.facebook.com/business/help/750785952855662
- Ads that click to WhatsApp: https://www.facebook.com/business/help/447934475640650
- Lead ad performance goals: https://www.facebook.com/business/help/782657799338685
- Personal attributes policy: https://www.facebook.com/business/help/2557868957763449
- Health and wellness policy: https://www.facebook.com/business/help/2489235377779939

## Recommended Campaign Architecture

Use fewer, clearer campaigns instead of many overlapping tests.

### 1. Odisha Core Lead Campaigns

Objective: WhatsApp/call enquiries from high-intent audiences.

Suggested structure:

- `SAN_ODI_BBSR_CORE_WA_YYYYMM`
- `SAN_ODI_BER_CORE_WA_YYYYMM`
- `SAN_ODI_ANG_CORE_WA_YYYYMM`
- `SAN_ODI_REGIONAL_CALL_YYYYMM`

Use location-specific ad sets, but keep the same primary WhatsApp and call numbers.

### 2. Cost And Decision Campaigns

Objective: capture treatment-planning intent.

Landing pages:

- `/ivf-cost-india`
- `/ivf-cost-bhubaneswar`
- `/ivf-cost-berhampur`
- `/pricing`
- `/know-your-score`

Angles:

- IVF cost clarity
- Consultation readiness
- What to ask before starting IVF
- Fertility planning in Odisha

### 3. Education And Trust Campaigns

Objective: warm cold audiences before WhatsApp/call retargeting.

Creative sources:

- Medium-to-Santaan articles
- Doctor videos
- YouTube Shorts
- Patient story/review pages
- Clinical explainers converted into patient-safe education

This campaign should not absorb too much budget. Its role is to feed warmer audiences and improve trust.

### 4. Retargeting Campaign

Objective: convert visitors who viewed important pages but did not contact.

Retargeting pools:

- Cost page visitors
- `know-your-score` visitors
- Centre page visitors
- Fertility insight readers
- Video viewers, if available in Meta

Messaging should be soft:

- "Still comparing fertility options?"
- "Need help understanding IVF cost?"
- "Speak with Santaan privately on WhatsApp."

Avoid:

- "Are you infertile?"
- "Struggling with PCOS?"
- "Unable to conceive?"

## Current Campaign Decision Matrix

Based on the visible 30-day Odisha account snapshot.

Also compare against the latest MOS leak snapshot. Any campaign with spend and low click-to-lead/call conversion must prove CRMAI quality before scale.

### Likely Winners To Preserve Or Scale Slowly

- `Vobiz testing campaign- North Eastern`: about Rs 24.56 per call.
- `SAN-C3-URB-PURI VOBIZ`: about Rs 28.22 per call.
- `BAM- Patrapur campaign VOBIZ`: about Rs 32.12 per call.
- `Western belt odisha`: about Rs 36.14 per call.
- `BERHAMPUR_CALL GEN CAMP`: about Rs 39.77 per call.

Action: preserve, then scale only 15-20% every 48 hours if lead quality is acceptable.

Important: the latest MOS snapshot shows `Western belt odisha` currently has the strongest click-to-lead efficiency among call/WhatsApp-style campaigns, while some previous apparent winners need Vobiz/CRMAI quality verification before scaling.

### Needs Repair Before Scaling

- `SAN-Q2-AngulPrivacy-Call`: about Rs 62.41 per call.

Action: keep capped, review creative and location radius, and compare call quality before increasing spend.

### Likely Inefficient Unless CRM Quality Is Excellent

- `SAN-C1-URB-PATIA (FORM)`: about Rs 303.58 per form lead.
- `SAN-C2-URB-CDA`: about Rs 339.58 per messaging conversation.

Action: do not scale. Either pause after approval or rebuild with WhatsApp-first intent, better qualifying questions, and clearer landing page/creative alignment.

### Drafts And Old Tests

There are unpublished drafts in Ads Manager.

Action: review one by one. If not part of the new structure, discard only after founder approval.

## Creative Strategy

Santaan should move from scattered campaign names to a repeatable creative testing system.

Core angles:

- Cost clarity: "Understand IVF cost before you start."
- Private guidance: "Ask a fertility counsellor on WhatsApp."
- Doctor authority: "Doctor-led fertility guidance in Odisha."
- Timing/readiness: "Know your fertility readiness score."
- Local trust: "Santaan care in Bhubaneswar, Berhampur and Angul."
- Education: "Simple fertility explainers, no panic."

Compliant phrasing examples:

- "Planning fertility care in Odisha?"
- "Compare IVF options with clear guidance."
- "Speak privately with Santaan on WhatsApp."
- "Understand IVF cost and next steps."

Avoid direct personal-attribute phrasing:

- "Are you infertile?"
- "Do you have PCOS?"
- "Failed IVF again?"
- "Unable to become pregnant?"

## Measurement System

Minimum tracking needed:

- Website: Meta pixel/dataset connected and receiving generic events.
- Ads: UTM parameters on all landing URLs.
- WhatsApp: prefilled messages by page/campaign.
- AICRM: capture source, campaign, ad set, ad, page, and WhatsApp/call intent.

Current measurement readiness: usable for basic remarketing and PageView audiences, not yet reliable for conversion bidding.

Confirmed working:

- Canonical pixel/dataset: `santaan` / `9115270055242145`.
- Connected ad account: `SANTAAN - ODISHA`.
- Website loads GTM, GA4, Facebook base script, and numeric Meta Pixel ID.
- First-party cookies and automatic advanced matching are on in Meta settings.

Known blockers before conversion scaling:

- No active Conversions API implementation from the website or AICRM.
- Meta Actions recommends setting up Conversions API for CRM/business chat events.
- Domain allowlist review is pending for `santaan.in` and related recently detected domains.
- Dataset category is unset; review before sending sensitive healthcare-adjacent events.
- Meta partially blocks some website data for European-region visitors because fertility/health content is sensitive. This is acceptable for Odisha-local campaigns but should be known.
- `Final Lead - Bud` custom conversion is not a clean lead event and should not be used as a primary optimisation event.
- MOS currently imports broad Meta platform leads/actions, but does not yet preserve a granular split of instant-form leads, WhatsApp conversations, calls, landing-page views, video views, and engagement actions.
- Because Santaan is WhatsApp/call-heavy, this action split is needed before the fresher can confidently diagnose lead leakage.

Recommended event names:

- `ViewContent`
- `Contact`
- `Lead`
- `Schedule`

Recommended lead quality stages in AICRM:

- New enquiry
- Responded
- Qualified
- Appointment booked
- Visited
- Treatment started

Optimise campaigns against qualified leads and appointment bookings, not only raw calls.

## Immediate Action Plan

### Phase 1: Stabilise

- Keep Odisha as the only active growth account.
- Keep Bangalore inactive.
- Mark SAI SCAN as legacy.
- Use `santaan` pixel/dataset ID `9115270055242145` as the primary Santaan tracking source.
- Keep that dataset connected to `santaan.in` and `SANTAAN - ODISHA`.
- Confirm domain verification remains active.
- Do not use the old no-data datasets for campaigns.
- Do not use the broad `Final Lead - Bud` custom conversion for bidding.

### Phase 2: Clean

- Export 30-day campaign/ad set/ad performance from Odisha.
- Add a lead-quality column manually from AICRM feedback.
- Identify duplicate campaigns by city, CTA, objective, and creative.
- Prepare pause list, scale list, and rebuild list.

### Phase 3: Rebuild

- Consolidate into the campaign architecture above.
- Move budget away from expensive form/message campaigns unless quality is strong.
- Keep winning call campaigns alive while WhatsApp-first replacements learn.
- Use three creative angles per city, not ten scattered campaigns.

### Phase 4: Optimise Weekly

- Every Monday: check spend, cost per lead, qualified lead rate, booked appointment rate.
- Every Wednesday: rotate weak creatives.
- Every Friday: scale winners slowly or pause losers after enough data.

## Founder Approval Needed Before Live Changes

- Pause or delete active campaigns.
- Discard unpublished drafts.
- Remove payment methods.
- Remove/downgrade people with access.
- Disconnect datasets/pixels.
- Remove SAI SCAN assets or partners.
- Generate or rotate Conversions API access tokens.
- Change custom conversion rules used by active campaigns.

## Practical Success Metric

The Meta account is healthier when:

- There are fewer duplicate campaigns.
- Odisha spend is concentrated into clear call/WhatsApp/cost-intent campaigns.
- Bangalore and SAI SCAN no longer distract the team.
- Pixel/dataset shows active, generic website events.
- AICRM shows which campaigns produce real appointments.
- Weekly decisions are made from cost per qualified lead, not raw Meta leads alone.
