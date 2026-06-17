# Santaan Meta, CRMAI, Vobiz and MOS Signal Audit

Date: 17 Jun 2026

## Executive verdict

Santaan's correct operating model is:

- Meta, Facebook, Instagram, WhatsApp and Vobiz are the primary patient acquisition surfaces.
- The website should stay compute-light: education, SEO, trust, and clean CTA routing only.
- CRMAI is the action system: lead capture, triage, telecalling, WhatsApp, follow-up and disposition.
- MOS is the intelligence system: platform spend, campaign feedback, patient objections, whitespace, listening, attribution, and conversion export feedback.

The architecture is directionally right, but the live signal loop is not yet decision-grade. MOS has data and Meta imports, but the canonical live session is still missing structured field feedback, listening cards, and healthy export records. CRMAI has action workflows and secrets for MOS, but the currently identified `origin/new-feature-final` branch does not clearly preserve the richer CRMAI -> MOS attribution sync path that exists in the older/current local CRM code.

Do not use current Meta page views or broad custom conversions as optimization truth. Optimize only after real CRMAI milestones flow into MOS and MOS can export clean conversion events.

## Measurement Readiness Index

Score: 64/100

Verdict: Unreliable, improving.

This setup is not broken. It has the right ingredients. But it is not yet safe for aggressive Meta automated optimization because true lead quality and appointment outcomes are not consistently flowing back to MOS/Meta.

| Category | Score | Why |
| --- | ---: | --- |
| Decision alignment | 20/25 | The roles are now clear: website educates, CRMAI acts, MOS learns. |
| Event model clarity | 13/20 | MOS has a good event taxonomy, but CRMAI/live Meta still mix generic leads, raw answers, and buried attribution. |
| Data accuracy and integrity | 11/20 | Website pixel/UTM intent works, MOS has live events, but click IDs and true quality milestones are incomplete. |
| Conversion definition quality | 7/15 | True milestone exports exist in code, but Meta custom conversion history includes over-broad definitions. |
| Attribution and context | 6/10 | MOS supports fbclid/gclid/fbp/fbc/ad IDs, but live website and CRMAI handoff are not consistently feeding them. |
| Governance and maintenance | 7/10 | SOPs and docs exist, but branch discipline and one canonical MOS session need tightening. |

## Evidence checked

Website:

- Live website is compute-light and should remain that way.
- Homepage and public pages use static/prerendered responses.
- GTM and Meta Pixel are present.
- WhatsApp CTA routes to `+91 96689 04011`.
- Call CTA routes to `+91 80 6548 1541`.
- Public page loads should not call `/api/blogs`.
- Current website UTM storage is basic and does not fully preserve click IDs such as `fbclid`, `_fbp`, `_fbc`, `gclid`, `gbraid`, `wbraid`, `ad_id`, `adset_id`.

Meta:

- Primary Santaan dataset/pixel observed: `santaan`, ID `9115270055242145`.
- Dataset is linked to Santaan/Odisha ad account.
- Events Manager showed mostly `PageView`, not a healthy stream of `Lead`, `Contact`, `Schedule`, or CRM quality events.
- Existing broad custom conversion pattern should not be used as final lead truth.
- Meta restrictions/domain/data category review remains important because Santaan is fertility/health related.

CRMAI:

- User clarified CRMAI branch as "feature-final"; the remote branch available locally is `origin/new-feature-final`.
- `origin/new-feature-final` contains strong action workflows: Meta lead webhook, WhatsApp, BhashSMS/Vobiz send paths, Vobiz inbound/menu/recording routes, patient feedback, queue/call workflows.
- CRMAI Cloudflare secrets include `MOS_BASE_URL` and `MOS_API_TOKEN`, so credential availability is not the blocker.
- The richer attribution sync path is visible in the local/current CRM code, including `lead_attribution`, `attribution_mappings`, `attribution_sync_jobs`, and CRMAI -> MOS sync payloads.
- That richer sync path is not clearly present in `origin/new-feature-final`; this is a branch/merge risk.

Vobiz:

- CRMAI has Vobiz inbound, menu, hold queue, bridge, and recording-ready code.
- Vobiz can create leads from inbound calls and attach call UUIDs.
- Campaign attribution depends on stable `ad_campaign` values in Vobiz URLs and correct MOS session mapping.
- Vobiz is essential for Santaan because the audience is WhatsApp/call heavy, not website-form heavy.

MOS:

- MOS Cloudflare secrets include `CRM_SYNC_SHARED_SECRET`, `META_CAPI_ACCESS_TOKEN`, Google Ads secrets, and `META_AD_LIBRARY_TOKEN`.
- MOS has routes for attribution events, external events, campaign feedback, platform imports, CAPI export, Google export, and growth recommendations.
- MOS D1 live check showed:
- `sessions`: 9
- `attribution_events`: 2747
- `platform_performance_snapshots`: 14
- Recent Meta platform import: 16 Jun 2026
- Overall attribution events include many generic `aicrm` leads, NeoDove leads, inbound-call leads, only a small number of explicit Meta/WhatsApp events.
- Canonical live session `ses_santaan_live_2026q2` showed many CRMAI leads and recent Meta snapshots, but:
- `campaign_feedback`: 0 rows
- `listening_cards`: 0 rows
- `attribution_exports`: no rows for live session
- `conversion_exports`: no rows for live session

## Critical gaps

1. CRMAI -> MOS continuity is the highest risk.

The older/current local CRM code contains rich attribution sync machinery. The remote `origin/new-feature-final` branch appears more action-focused and may not include that same bridge. Before deploying or merging CRM changes, the developer must confirm the final CRMAI branch includes:

- `lead_attribution`
- `attribution_mappings`
- `attribution_sync_jobs`
- MOS sync to `/api/attribution/external-events` or equivalent
- milestone sync for `lead`, `qualified_lead`, `consult_booked`, `consult_showed`, `cycle_started`

2. Meta optimization truth is not ready.

Meta Pixel has page view signal, but the business should not optimize around page views, broad URL custom conversions, or CTA clicks. For Santaan, useful optimization truth is:

- real WhatsApp conversation started
- real phone call connected
- qualified lead
- consultation booked
- consultation showed
- treatment-qualified
- cycle started

3. Website attribution is too thin for paid traffic learning.

The website should not become a CRM, but it should pass a clean attribution envelope when a patient submits a form or starts a tracked CTA journey.

Minimum website fields to preserve:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- `fbclid`, `_fbp`, `_fbc`
- `gclid`, `gbraid`, `wbraid`
- `ad_id`, `adset_id`, `campaign_id` where available
- `landing_path`, `referrer`, `cta_kind`, `cta_label`, `center`

4. MOS is under-used as the intelligence layer.

MOS has the tables and logic, but the live default session has no structured campaign feedback and no listening cards. This means the "why" behind campaign performance is not yet being captured.

5. Vobiz attribution needs operational discipline.

Every Vobiz DID/application used for Santaan should have a stable campaign URL, for example:

```txt
/api/vobiz/inbound?ad_campaign=Meta_Digital
/api/vobiz/inbound?ad_campaign=Physical_Camps
/api/vobiz/inbound?ad_campaign=TV
```

The campaign code must map into the correct MOS session. If the campaign is `default`, MOS cannot learn properly.

## Recommended event contract

Use this as the shared language across website, CRMAI, Vobiz and MOS.

| Event | Source | Lands in | Use |
| --- | --- | --- | --- |
| `page_view` | Website/GTM/Meta | Meta/GA4 | Remarketing only, not final conversion |
| `cta_clicked` | Website | GTM/GA4, optional CRMAI context | Intent signal only |
| `lead` | Meta form, website form, WhatsApp, Vobiz | CRMAI then MOS | First contact |
| `whatsapp_conversation_started` | Meta/WhatsApp/Bhash/Vobiz webhook | CRMAI then MOS | Patient intent |
| `inbound_call_started` | Vobiz | CRMAI then MOS | Call lead |
| `call_connected` | Vobiz/CRMAI | CRMAI then MOS | Telecalling quality |
| `qualified_lead` | CRMAI disposition | MOS then Meta CAPI | Optimization-quality event |
| `consult_booked` | CRMAI | MOS then Meta CAPI | Strong conversion |
| `consult_showed` | CRMAI | MOS then Meta CAPI | Very strong conversion |
| `cycle_started` | CRMAI/manual verified | MOS then Meta CAPI | Business outcome |
| `campaign_feedback` | Fresher/telecaller/ad manager | MOS | Learning loop |
| `listening_card` | MOS research/social/competitor input | MOS | Whitespace and creative insight |

## CRMAI as action system

CRMAI should own:

- all raw leads from Meta forms, WhatsApp, Vobiz, website forms, manual/camp uploads
- telecaller assignment
- call attempts and recordings
- WhatsApp replies and template sends
- patient status and disposition
- appointment booking/show status
- real lead quality
- consent-sensitive patient details

CRMAI should not be the primary campaign intelligence dashboard. It should emit clean milestone events into MOS.

Required CRMAI output to MOS:

```json
{
  "businessSlug": "santaan",
  "sourceSystem": "crmai",
  "crmLeadId": "lead_xxx",
  "externalEventId": "crmai:lead_xxx:qualified_lead",
  "eventType": "qualified_lead",
  "platform": "meta",
  "channel": "whatsapp",
  "source": "meta",
  "campaignName": "odisha_ivf_whatsapp",
  "campaignExternalId": "meta_campaign_id",
  "adsetExternalId": "meta_adset_id",
  "adExternalId": "meta_ad_id",
  "fbclid": "optional",
  "fbc": "optional",
  "fbp": "optional",
  "gclid": "optional",
  "phone": "raw only to MOS endpoint, MOS hashes before storage",
  "metadata": {
    "center": "Bhubaneswar",
    "lead_source_detail": "vobiz_inbound",
    "ad_campaign": "Meta_Digital"
  }
}
```

## MOS as intelligence system

MOS should own:

- weekly campaign spend and platform import
- competitor and social listening
- patient objections and repeated language
- ad creative feedback from calls/WhatsApp
- whitespace hypotheses
- campaign-level decisions: scale, pause, revise, retarget
- Meta CAPI and Google conversion export health
- founder/fresher weekly operating reports

MOS should not store unnecessary medical detail. It should store hashed identifiers, campaign markers, event stage, and structured feedback.

## Priority implementation order

1. Freeze website scope.

Keep Santaan website as static SEO/trust/CTA. Do not reintroduce Turso, CRM dashboards, voice ops, cron jobs, or MOS computation into the website.

2. Confirm final CRMAI branch.

Developer must reconcile `origin/new-feature-final` with the attribution-sync code currently visible in the local CRMAI tree. The final CRMAI branch must not lose MOS sync.

3. Make CRMAI -> MOS sync the primary bridge.

On every meaningful lead milestone, CRMAI should write/send a MOS external event. The first pass can sync:

- lead created
- qualified lead
- consult booked
- consult showed
- cycle started

4. Normalize campaign sources.

All Meta, WhatsApp and Vobiz campaigns should use stable lowercase campaign slugs. Avoid `default`.

5. Create live-session MOS feedback habit.

Every working day, the fresher should add 5-10 structured feedback entries to `ses_santaan_live_2026q2`:

- lead source
- city
- patient objection
- winning phrase
- confusing claim
- intent quality score
- message fit score
- suggested ad/script/page change

6. Validate Meta CAPI with test mode, then production.

Only after CRMAI quality events are reaching MOS, run MOS Meta export first in validate/test mode, then production. The event to start with should be `qualified_lead` or `consult_booked`, not `page_view`.

7. Repair Google only after Meta loop is stable.

Google export currently has historical errors. Since Santaan is Meta/WhatsApp-heavy, fix Meta and MOS feedback first. Google can wait unless spend shifts there.

## Fresher daily SOP

Morning:

- Check Meta campaigns: spend, leads, WhatsApp conversations, calls, CPL.
- Check CRMAI: new leads, assigned leads, missed calls, uncontacted leads, WhatsApp replies.
- Check Vobiz: missed calls, recordings, call-connected quality.

Afternoon:

- Add structured campaign feedback into MOS.
- Record patient objections in the patient's own language.
- Mark whether the ad promise matched the call conversation.
- Flag repeated questions for website FAQ/blog/creative.

Evening:

- Compare Meta lead volume with CRMAI quality.
- Note which campaigns produced real conversations, not just cheap leads.
- Recommend one action only: scale, pause, revise, or observe.

Weekly:

- Import Meta platform performance into MOS.
- Review MOS recommendations.
- Choose one whitespace angle or creative test.
- Do not change multiple variables at once.

## What not to do

- Do not optimize Meta on page views.
- Do not treat every WhatsApp click as a patient lead.
- Do not put raw diagnosis or sensitive medical details into Meta custom events.
- Do not reconnect heavy CRM code to the public website.
- Do not let campaign URLs use `default` or vague campaign names.
- Do not merge CRMAI branches until the MOS sync bridge is verified.
- Do not judge campaigns only by Meta's lead count; use CRMAI quality and MOS feedback.

## Final target state

When this is working, the founder should be able to ask:

- Which Meta campaign produced qualified couples, not just leads?
- Which WhatsApp/call ads produced real appointments?
- Which city/source has low-cost but low-quality leads?
- Which patient objection is repeating this week?
- Which competitor angle is gaining attention?
- Which ad promise should be scaled, paused or rewritten?
- Did Meta CAPI receive real quality events from CRMAI through MOS?

That is the success state: Meta brings attention, CRMAI converts action, Vobiz captures calls, and MOS explains what to do next.
