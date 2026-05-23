# Patient Reviews GitHub Workflow

This website uses simple Markdown files for curated Google, Facebook, and patient-story content.

No Netlify Identity, Git Gateway, database, or CMS login is required.

## Where Reviews Live

Review files are stored here:

```text
content/patient-reviews/
```

Use this file as the starting point:

```text
content/patient-reviews/_TEMPLATE.md
```

Files beginning with `_` are ignored by the website.

## How To Add A Review In GitHub

1. Open the repo on GitHub.
2. Go to `content/patient-reviews/`.
3. Open `_TEMPLATE.md`.
4. Copy the full file content.
5. Select `Add file` → `Create new file`.
6. Name the file with a clear slug, for example `bhubaneswar-google-review-may-2026.md`.
7. Paste the template.
8. Edit the fields and review text.
9. Keep `status: draft` while preparing.
10. Change to `status: approved` only when ready for the website.
11. Commit directly to `main` only if approved, or create a pull request if review is needed.

## Required Fields

```yaml
status: approved
platform: google
displayName: "A*** P."
city: "Bhubaneswar"
center: "bhubaneswar"
rating: 5
reviewDate: ""
sourceUrl: ""
featured: true
displayOrder: 1
tags: ["ivf", "staff"]
consent: "public_review"
```

## Field Rules

- `status`: use `draft`, `approved`, or `archived`.
- `platform`: use `google`, `facebook`, `patient-story`, or `internal`.
- `displayName`: anonymize unless explicit consent exists, for example `S*** R.` or `Anonymous patient`.
- `center`: use `bhubaneswar`, `berhampur`, `angul`, or `bangalore`.
- `rating`: use `1` to `5`; leave blank only for non-star patient stories.
- `sourceUrl`: add the original Google/Facebook review link when available.
- `featured`: use `true` to show on homepage; use `false` for full page only.
- `displayOrder`: smaller numbers appear first.
- `consent`: use `public_review` for public Google/Facebook reviews or `written_consent` for directly collected stories.

## Publishing Rules

- Only `status: approved` appears on the website.
- Only `featured: true` appears in the homepage review section.
- All approved reviews appear on `/patient-stories`.
- The site deploys automatically after GitHub changes are merged and Netlify builds.

## Editorial Safety

- Do not publish phone numbers, addresses, medical record details, or private identifiers.
- Do not promise pregnancy, success, or guaranteed outcomes.
- If rewriting for grammar, preserve the original meaning.
- If the name is changed, show an anonymized name and avoid saying it is an exact quote.
- For edited reviews, prefer page language like `Patient stories` or `Patient feedback`.

## Test After Publishing

Check:

```text
/
/patient-stories
```

Expected:

- Homepage shows the featured approved reviews.
- `/patient-stories` shows all approved reviews.
- Draft and archived files do not appear.
