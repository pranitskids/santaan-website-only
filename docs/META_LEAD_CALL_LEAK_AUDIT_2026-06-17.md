# Santaan Meta Lead And Call Leak Audit

Date: 17 Jun 2026

Purpose: explain why Santaan may be running campaigns but not seeing enough real leads, calls or WhatsApp conversations in CRMAI.

## Founder-level verdict

The problem is not only tracking. The live Meta snapshot shows several campaigns spending money, generating impressions and clicks, but not producing enough measurable lead/call outcomes.

This means we must audit the full leak path:

```txt
Ad delivery -> creative click -> CTA handoff -> WhatsApp/call/form -> CRMAI lead -> MOS intelligence -> Meta feedback
```

If any step is weak, Meta will show activity but the clinic will not feel patient enquiries.

## Live MOS Meta snapshot checked

Source: MOS D1 `platform_performance_snapshots`

- Session: `ses_santaan_live_2026q2`
- Week start: `2026-06-15`
- Last Meta import: `2026-06-16T10:32:34.521Z`

| Campaign | Spend | Impressions | Clicks | Meta leads/actions | CTR | Click-to-lead | Diagnosis |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `SAN-C1-URB-PATIA (FORM)` | Rs 1,273 | 10,433 | 110 | 25 | 1.05% | 22.73% | Platform lead volume exists; CRMAI quality must decide whether to scale. |
| `Urban Precision BBSR-CTC-PURI - Copy` | Rs 921 | 46,440 | 325 | 0 | 0.70% | 0% | Spend leak unless it is intentionally awareness-only. |
| `SAN-C3-URB-PURI VOBIZ` | Rs 895 | 59,669 | 684 | 7 | 1.15% | 1.02% | Click-to-lead leak; Vobiz/CTA/call connection must be checked. |
| `RETARGET Leads campaign` | Rs 834 | 32,456 | 502 | 1 | 1.55% | 0.20% | Retargeting leak; audience or offer likely mismatched. |
| `Vobiz testing campaign- North Eastern` | Rs 823 | 51,625 | 625 | 7 | 1.21% | 1.12% | Produces some leads, but many clicks do not become calls/leads. |
| `BAM- Patrapur campaign` | Rs 740 | 44,356 | 466 | 2 | 1.05% | 0.43% | Underperforming unless CRMAI shows unusually high quality. |
| `SAN-C2-URB-CDA` | Rs 699 | 23,012 | 115 | 0 | 0.50% | 0% | Strong pause/repair candidate. |
| `C5_ Happy Raja Dr. kaninika panda` | Rs 573 | 31,553 | 310 | 0 | 0.98% | 0% | Engagement/awareness leak if expected to generate leads. |
| `BBSR CALL Leads campaign` | Rs 545 | 30,697 | 363 | 2 | 1.18% | 0.55% | Call handoff leak likely. |
| `SAN-Q2-AngulPrivacy-Call` | Rs 471 | 18,297 | 235 | 1 | 1.28% | 0.43% | Needs repair before scale. |
| `SAN-C1-URB-PATIA` | Rs 464 | 23,660 | 323 | 3 | 1.37% | 0.93% | Weak unless CRMAI quality is high. |
| `Western belt odisha` | Rs 426 | 20,958 | 241 | 6 | 1.15% | 2.49% | Best current click-to-lead efficiency among call/WhatsApp-style campaigns. |
| `SAN-C3-URB-PURI` | Rs 426 | 14,464 | 141 | 0 | 0.97% | 0% | Leak unless awareness-only. |
| `BERHAMPUR_CALL GEN CAMP` | Rs 340 | 12,058 | 128 | 0 | 1.06% | 0% | Needs call tracking verification. |

## What this means

There are four different leak types.

### 1. Delivery leak

Meta is showing ads to many people, but CTR is weak or intent is low.

Signals:

- CTR below roughly 0.8-1.0% for direct-response fertility campaigns.
- High impressions with low clicks.
- Creative is too generic, festival/awareness-led, or not strongly connected to the patient decision.

Likely examples:

- `Urban Precision BBSR-CTC-PURI - Copy`
- `SAN-C2-URB-CDA`

### 2. CTA handoff leak

People click, but they do not become WhatsApp/call/form leads.

Signals:

- CTR is acceptable.
- Click-to-lead is below 1-2%.
- Many clicks, few calls/messages.

Likely examples:

- `RETARGET Leads campaign`
- `BBSR CALL Leads campaign`
- `SAN-Q2-AngulPrivacy-Call`
- `BAM- Patrapur campaign`

Possible causes:

- Wrong objective for the desired action.
- CTA says call/WhatsApp but destination does not reduce friction.
- WhatsApp/account routing mismatch.
- Vobiz call line not mapping calls into CRMAI.
- Campaign sends to a landing page but the page does not immediately answer the ad promise.
- Ad promise is too soft for high-intent action.

### 3. Visibility leak

The lead/call may happen, but the team cannot see it correctly.

Current MOS importer stores a broad `platform_leads` count. It does not yet preserve a granular breakdown of:

- Meta instant-form leads
- WhatsApp/messaging conversations
- click-to-call/call actions
- website leads
- landing page views
- post engagements/video views

This is a measurement blocker. A campaign may look weak or strong for the wrong reason.

### 4. Learning leak

MOS has platform imports, but the live session currently has no structured feedback rows and no listening cards.

That means we do not yet know:

- which objections are stopping patients
- whether the ad promise matches telecaller conversations
- whether WhatsApp replies are asking about price, privacy, success rate, distance, doctor, or timing
- which competitors or content angles are pulling attention

Without this, the fresher can only report numbers, not improve campaigns.

## Immediate campaign triage

Use this until CRMAI quality data is connected.

### Preserve and verify quality

- `SAN-C1-URB-PATIA (FORM)` because platform leads are coming at low cost.
- `Western belt odisha` because click-to-lead is currently strongest among call/WhatsApp style campaigns.
- `Vobiz testing campaign- North Eastern` and `SAN-C3-URB-PURI VOBIZ` only if Vobiz/CRMAI confirms real connected calls.

### Repair before scaling

- `RETARGET Leads campaign`
- `BAM- Patrapur campaign`
- `BBSR CALL Leads campaign`
- `SAN-Q2-AngulPrivacy-Call`
- `SAN-C1-URB-PATIA`

Repair means: check objective, destination, CTA wording, city targeting, Vobiz routing, CRMAI source visibility and creative promise.

### Pause or rebuild after approval

- `Urban Precision BBSR-CTC-PURI - Copy`
- `SAN-C2-URB-CDA`
- `C5_ Happy Raja Dr. kaninika panda`
- `SAN-C3-URB-PURI`
- `BERHAMPUR_CALL GEN CAMP`

Do not pause automatically. These are "show cause" campaigns: they must prove strategic value or be rebuilt.

## Meta account checks that can block lead volume

The fresher/ad manager should inspect these before blaming creative.

### Account and asset checks

- Correct ad account selected: `SANTAAN - ODISHA`.
- Correct Page selected: Santaan patient-facing Page, not academy/old/other brand.
- Correct Instagram account selected and connected.
- Correct WhatsApp account/phone selected for click-to-WhatsApp ads.
- No ads accidentally routed to SKIDS, Bangalore/R&D, SAI SCAN, old Santaan assets, or wrong phone numbers.
- Billing/payment has no delivery warning.
- No campaign/ad set/ad has rejection, limited learning, policy, or account-quality warning.

### Objective and optimization checks

- Lead forms should optimize for submitted forms, not traffic.
- WhatsApp campaigns should optimize for messaging conversations, not link clicks.
- Call campaigns should optimize for calls where available, not reach/traffic.
- Retargeting should not be optimized to a broad page-view conversion.
- Do not optimize against `Final Lead - Bud` because it is too broad.

### Placement checks

- For clinic lead generation, do not let low-intent placements consume budget unchecked.
- Break down by placement weekly:
- Facebook Feed
- Instagram Feed
- Instagram Reels
- Facebook Reels
- Stories
- Audience Network

If a placement spends but has no calls/messages/leads, exclude or isolate it in a test.

### Geography checks

- Focus on Odisha catchments: Bhubaneswar, Berhampur, Angul and relevant nearby districts.
- Bangalore should not receive clinic lead budget because it is R&D only.
- If a campaign name says Puri, Patia, CDA, Angul or Berhampur, the ad set geography must match that promise.

### Message-match checks

For every ad, the first destination must answer the exact ad promise.

Examples:

- Cost ad -> cost page or WhatsApp prefill about cost.
- Privacy/advice ad -> WhatsApp first.
- Readiness ad -> `/know-your-score`.
- Doctor video ad -> doctor/video page plus WhatsApp.
- Call ad -> Vobiz/call line that CRMAI can see.

## MOS build requirement

MOS should separate Meta imported action types instead of only storing broad `platform_leads`.

Recommended additional fields:

- `meta_form_leads`
- `meta_messaging_conversations`
- `meta_call_actions`
- `meta_website_leads`
- `meta_landing_page_views`
- `meta_video_views`
- `meta_post_engagements`
- `raw_actions_json`

This will let the team answer:

- Did this campaign generate WhatsApp conversations or just clicks?
- Did this call campaign generate call actions or only traffic?
- Did this form campaign create low-cost leads that CRMAI later rejected?
- Which placements generate real conversations?

## CRMAI build requirement

CRMAI must attach source and campaign context to every lead/call.

Minimum fields:

- `source_system`
- `source`
- `channel`
- `platform`
- `campaign_name`
- `campaign_external_id`
- `adset_external_id`
- `ad_external_id`
- `form_id`
- `ad_campaign`
- `vobiz_call_uuid`
- `whatsapp_message_id`
- `phone_number_id`
- `landing_path`
- `utm_*`
- click IDs where available

## Daily operator rule

Every campaign with spend must be classified daily:

- `working`: leads/calls plus CRMAI quality visible
- `needs proof`: Meta says results but CRMAI cannot confirm quality
- `leaking`: clicks/reach but no leads/calls
- `blocked`: rejected, wrong asset, wrong destination, payment/permission issue
- `learning`: awareness/education campaign intentionally not judged by immediate leads

No campaign should stay in `needs proof` or `leaking` for more than 3 working days without a founder-approved decision.

## Success criteria

Santaan Meta becomes healthy when:

- every rupee of spend is tied to a clear objective
- every call/WhatsApp/form lead lands in CRMAI with source context
- MOS can split forms vs WhatsApp vs calls
- the fresher can identify leaks before spend is wasted
- weekly optimization uses CRMAI quality and MOS feedback, not Meta lead count alone
