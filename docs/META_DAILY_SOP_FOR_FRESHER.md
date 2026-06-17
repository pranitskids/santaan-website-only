# Santaan Meta Daily SOP

Last updated: 2026-06-17

Audience: junior/fresher digital marketing operator managing Santaan Meta campaigns.

This SOP keeps Santaan's Meta activity evidence-based, focused, and safe. Do not improvise live changes outside this protocol.

## Active Working Surface

Use only these Santaan assets for normal campaign work:

- Business portfolio: `Santaan IVF`
- Page: `Santaan Fertility`
- Ad account: `SANTAAN - ODISHA`
- Website: `https://www.santaan.in`
- WhatsApp CTA: `+91 96689 04011`
- Call CTA: `+91 80 6548 1541`

Do not use these for Santaan growth work:

- `Santaan - BNG`: Bangalore is R&D only, not a clinic growth account. This account is in closure flow and should not be used.
- `SAI SCAN`: removed from Santaan business portfolio.
- `SKIDS`: separate brand. Do not touch for Santaan work.
- `Santaan Fertility Academy`: do not use unless founder specifically approves an academy/professional education campaign.

## Daily Checklist

Do this once every working day.

1. Open Meta Ads Manager and select only `SANTAAN - ODISHA`.
2. Check yesterday and last 7 days performance.
3. Record spend, leads, calls, WhatsApp conversations, cost per result, and notes in the reporting sheet.
4. Check if any campaign/ad set/ad has delivery warnings, rejected ads, or payment alerts.
5. Check comments/messages on active ads for patient queries or negative feedback.
6. Classify every spending campaign as `working`, `needs proof`, `leaking`, `blocked`, or `learning`.
7. Share urgent patient enquiries with the CRM/counselling team. Do not answer medical questions yourself.
8. Do not publish drafts, pause campaigns, increase budgets, or create new ads without approval.

## Weekly Optimisation Rhythm

Every Monday:

- Review last 7 days and last 30 days.
- Identify winners, weak campaigns, and noisy/duplicate campaigns.
- Match Meta leads with AICRM quality: qualified, appointment booked, visited, treatment started.

Every Wednesday:

- Refresh weak creatives only if they have enough data.
- Keep compliant, patient-safe wording.
- Do not use fear, diagnosis assumptions, or personal-attribute language.

Every Friday:

- Recommend scale, pause, or rebuild actions.
- Founder/manager must approve before action.

## Decision Rules

Scale slowly when:

- Cost per qualified lead is improving.
- AICRM confirms real patient conversations.
- The campaign has enough data and no compliance issue.
- Budget increase is only 15-20%, then wait 48 hours.

Repair when:

- Cost is high but lead quality is good.
- Creative is relevant but location/audience/CTA needs tuning.
- Campaign has mixed objectives or unclear message.

Pause after approval when:

- Cost is high and AICRM quality is poor.
- Campaign duplicates another campaign.
- Campaign is for Bangalore/R&D, SAI SCAN, or another non-Santaan clinic asset.
- Campaign objective is not aligned with WhatsApp/call/book consultation.

Never judge only by Meta's raw lead count. Use qualified lead and appointment quality from AICRM.

No campaign should stay in `needs proof` or `leaking` for more than three working days without a founder-approved action.

## Current Campaign Direction

Preferred CTAs:

- WhatsApp first for warm leads.
- Call for high-intent local patients.
- Website landing pages for cost/education/readiness journeys.

Preferred landing pages:

- `/ivf-cost-india`
- `/ivf-cost-bhubaneswar`
- `/ivf-cost-berhampur`
- `/pricing`
- `/know-your-score`
- `/fertility-insights`
- `/contact-centres`

Preferred campaign groups:

- Odisha core WhatsApp/call campaigns.
- City-specific cost clarity campaigns.
- Education/trust campaigns using approved articles and videos.
- Retargeting for website visitors and video viewers.

## Safe Copy Rules

Use:

- "Planning fertility care in Odisha?"
- "Understand IVF cost and next steps."
- "Speak privately with Santaan on WhatsApp."
- "Doctor-led fertility guidance in Bhubaneswar, Berhampur and Angul."

Avoid:

- "Are you infertile?"
- "Do you have PCOS?"
- "Failed IVF again?"
- "Unable to become pregnant?"
- Any copy that implies Meta knows the viewer's medical condition.

## Reporting Sheet Columns

Maintain these columns at minimum:

- Date
- Campaign
- Ad set
- Ad
- Location/city
- Objective
- CTA
- Landing page
- Spend
- Impressions
- Reach
- Clicks
- Calls
- WhatsApp conversations
- Form leads
- Cost per result
- AICRM qualified leads
- Appointments booked
- Visits
- Notes
- Recommended action: keep, scale, repair, pause
- Approval status
- Leak status: working, needs proof, leaking, blocked, learning
- Leak reason: delivery, CTA handoff, Vobiz/call routing, WhatsApp routing, creative promise, tracking visibility, CRMAI quality

## Approval Required

Ask before doing any of these:

- Pause live campaigns.
- Publish drafts.
- Discard drafts.
- Increase budget.
- Create a new campaign.
- Remove people or partners.
- Change billing/payment methods.
- Disconnect pixels, datasets, WhatsApp accounts, Instagram accounts, or Pages.

## Cleanup Status

Completed:

- `Santaan - BNG` ad account moved into closure flow. Meta says closure may take about three working days.
- `SAI SCAN` removed from the Santaan business portfolio.
- Santaan website is now compute-light and website-focused.
- Primary Santaan Meta pixel/dataset selected: `santaan`, ID `9115270055242145`.
- `santaan` pixel/dataset is connected to the `SANTAAN - ODISHA` ad account.
- Vercel `META_PIXEL_ID` was corrected and redeployed so the website no longer renders a masked pixel placeholder.

Still to decide:

- Whether to remove or add `Dipti Sahoo` for the primary `Santaan Fertility` Page access review.
- Whether `Santaan Fertility Academy` should stay in the Santaan portfolio or be ignored in daily workflow.
- Whether `SKIDS` should stay visible here for owner convenience or be managed only under the SKIDS business.
- Whether to configure AICRM or WhatsApp/business-chat Conversions API feedback into the selected `santaan` dataset.
- Whether to create clean custom conversions after CAPI or generic Lead/Contact events are available.
- Whether to extend MOS Meta imports to split form leads, WhatsApp conversations, calls, landing-page views, video views, and engagements instead of one broad platform lead number.

Do not use:

- `SANTAAN ODISHA` dataset for optimisation because it showed no data connected.
- `Santaan Meta ads` dataset for optimisation because it showed no data connected.
- `Final Lead - Bud` as a primary conversion because its rule is too broad and can count ordinary website traffic.

Related audit:

- [META_LEAD_CALL_LEAK_AUDIT_2026-06-17.md](/Users/spr/santaan%20hope/santaan-website-only/docs/META_LEAD_CALL_LEAK_AUDIT_2026-06-17.md:1)

## Operating Principle

The fresher's job is not to click more buttons. The job is to observe, record, compare with AICRM quality, and recommend evidence-based actions. Every live change should have a reason, a metric, and an approval trail.
