# Blog Writer Guide — Santaan

## Primary publishing path
Publish new Santaan articles directly inside this repo using the write-drop workflow in `content/write-drop/`. Medium is now optional syndication, not the source of truth.

## Purpose
Help new patients feel warmth, hope, and clarity. Every piece should reduce anxiety and lead readers to one gentle next step.

---

## 📰 Two Types of Content on Santaan

### 1. Blog Posts → Appears in "Insights & Stories" Section
Regular educational content about fertility, IVF, health tips, myths, etc.
- **How to publish:** Add a Markdown file in `content/write-drop/` with `type: blog`
- **Approval rule:** Set `status: approved` only when the post is ready to go live

### 2. News & Announcements → Appears in "News & Announcements" Section
Updates about new centers, awards, campaigns, events, offers.
- **How to publish:** Add a Markdown file in `content/write-drop/` with `type: news`
- Appears right after Awards section on homepage

---

## 🏷️ Frontmatter Guide for News/Announcements

| Content Type | Required Tag | Optional Additional Tags |
|-------------|--------------|-------------------------|
| General News | `type: news` | tags like `launch`, `campaign` |
| Awards/Recognition | `type: news` | `award`, `recognition` |
| New Center Opening | `type: news` | `launch`, `campaign` |
| Events/Seminars | `type: news` | `event`, `seminar`, `workshop` |
| Special Campaigns | `type: news` | `campaign`, `offer` |

### News Post Examples:

**Award:**
```
type: news
tags: [award, recognition]
Title: "Santaan Wins Best IVF Clinic Award 2026"
```

**New Center:**
```
type: news
tags: [launch]
Title: "Santaan Opens New Center in Brookefield, Bengaluru"
```

**Event:**
```
type: news
tags: [event, seminar]
Title: "Free Fertility Awareness Seminar - March 2026"
```

---

## 📍 Where Content Appears on Website

```
┌─────────────────────────────────────────┐
│              WEBSITE FLOW               │
├─────────────────────────────────────────┤
│ Hero                                    │
│ Success Stories                         │
│ Awards                                  │
│ ★ NEWS & ANNOUNCEMENTS ← type: news    │
│ MythBusting                             │
│ Assessment                              │
│ ★ INSIGHTS & STORIES ← regular posts   │
│ WonderOfLife                            │
│ Doctors, Locations, FAQ                 │
│ Footer                                  │
└─────────────────────────────────────────┘
```

| Section | Tag Required | Max Posts Shown |
|---------|-------------|-----------------|
| News & Announcements | `type: news` | 4 |
| Insights & Stories | `type: blog` | 6 |

⏱️ Posts appear on website as soon as the approved PR is merged and Vercel deploy finishes.

---

## Voice & Tone
- Warm, human, and respectful (no blame, no pressure).
- Science translated into simple, reassuring language.
- Narrative-first: open with a relatable moment, end with a hopeful next step.

## Structure (900–1400 words)
1. **Opening scene (80–120 words):** A short patient-like moment.
2. **Myth or question (1–2 lines):** What most people get wrong.
3. **Clear explanation (200–300 words):** Simple science + practical context.
4. **What this means for you (3–5 bullets):** Actionable takeaways.
5. **Santaan approach (100–150 words):** How we help, without hard selling.
6. **Gentle CTA (1–2 lines):**
   - “Take the Santaan Signal assessment”
   - “Ask Santaan AI for a quick answer”
   - “Subscribe for daily guidance”

## Required CTAs (choose 1–2 per post)
- Link: #santaan-signal — “Take the Santaan Signal”
- Link: #newsletter — “Get daily fertility guidance”
- Mention: “Ask Santaan AI” (bottom-right on the site)

## SEO & Internal Links
- Use 1 primary keyword + 3 supporting keywords.
- Add 2–3 internal links to sections:
  - #myth-busting (Myths)
  - #santaan-signal (Assessment)
  - #insights (Insights & Stories)
- Keep title under 60 characters; meta description under 155.

## Content Pillars (rotate weekly)
1. **Fertility Fundamentals** (cycle, ovulation, egg/sperm quality)
2. **Treatment Clarity** (IUI/IVF/ICSI, timelines, safety)
3. **Lifestyle & Nutrition** (sleep, stress, BMI, supplements)
4. **Male Fertility** (motility, morphology, lifestyle)
5. **Emotional Health** (relationship, support, stigma)

## Narrative Style Examples
- “She tracked her cycle for months, yet nothing changed…”
- “He thought fitness meant fertility—until the first test.”

## Medical Safety
- No guarantees or exact success promises.
- Encourage medical consultation for personal cases.

## Visual & Formatting
- Short paragraphs (2–4 lines).
- Use subheadings every 150–200 words.
- Include 1–2 bullet lists per post.
