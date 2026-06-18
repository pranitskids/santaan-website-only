# Santaan Write Drop Workflow

This is the new primary publishing model for Santaan blog content.

It mirrors the lightweight in-repo content workflow we have used on SKIDS-style properties: writers prepare Markdown, the website owns the final URL, and SEO authority stays on the main domain.

## Where blog files live

```text
content/write-drop/
```

Use this template:

```text
content/write-drop/_TEMPLATE.md
```

Files beginning with `_` are ignored by the website.

## What gets published

- `status: approved` files are published.
- `status: draft` files are ignored.
- `status: archived` files are hidden from listing pages.

## Supported post types

- `type: blog` for patient-facing posts shown under `/fertility-insights`
- `type: doctor` for clinician-facing posts shown under `/clinical-insights`
- `type: news` for announcements available through the shared content API

## Recommended GitHub flow

1. Open the repo in GitHub.
2. Go to `content/write-drop/`.
3. Copy `_TEMPLATE.md`.
4. Create a new file with a clean slug, for example:
   - `pcos-ovulation-fertility-basics.md`
   - `ai-embryo-selection-2026.md`
5. Fill the frontmatter and article body.
6. Keep `status: draft` until review is complete.
7. Change to `status: approved` when it is ready to publish.
8. Open a pull request for review and QA.
9. Merge into the production website branch after approval.

## Field reference

```yaml
status: approved
type: blog
title: "PCOS and ovulation: what patients should know"
excerpt: "A short summary used on cards and metadata."
publishedAt: "2026-06-18T09:00:00.000Z"
author: "Santaan Editorial Team"
thumbnail: "/assets/hero-family.png"
tags: ["pcos", "ovulation", "fertility"]
sourceUrl: ""
```

## Important rules

- Use Markdown only. No need to publish on Medium first.
- Keep `sourceUrl` blank for Santaan-first posts.
- If a post is later syndicated elsewhere, keep Santaan as the original publication and use canonical strategy there, not here.
- Use local Santaan image paths for `thumbnail` whenever possible.
- Add real Santaan internal links inside the article body.

## SEO behavior

- Approved write-drop posts are merged ahead of legacy Medium archive content.
- They get Santaan-owned article URLs immediately.
- Patient and clinical quality filters still apply before pages enter the sitemap.
- Legacy Medium posts remain available only as fallback archive content.

## QA checklist

After approving a post, test:

- `/fertility-insights` or `/clinical-insights`
- the direct article URL
- `/sitemap.xml`
- page title, description, canonical, and CTA links

## Guardrail

Do not move new Santaan blog publishing back to Medium unless there is an explicit syndication reason. Santaan should publish on Santaan first.
