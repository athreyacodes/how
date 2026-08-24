---
name: write-how-note
description: Write and revise notes for the How blog (how.athreya.codes). Use when adding or editing markdown in content/posts, drafting a new How note, or when the user asks to write a blog post, article, or note for How.
---

# Write a How note

Notes live in `content/posts/{slug}.md`. After writing, run `node scripts/content.mjs --drafts` so local `npm start` picks them up.

A note is one decision you would explain to a teammate. Not a topic survey. Not a docs page.

## Voice

Write like a person talking to a teammate. Short sentences. Plain words. Contractions are fine.

Bad: "This approach facilitates crawlable delivery of prerendered artifacts."
Good: "The crawler should get the real page, not an empty shell."

Be generous with explanation. Do not compress a note into a few dense paragraphs. If a step needs a why, write the why.

## Shape

Use these headings, in this order, with this wording. You can add more after them if the note needs it. Do not skip the first three.

```md
## **What** was the situation
## **When** does this apply
## **How** is it done
## Watch out for
```

1. **What** was the situation — What was in front of you and what was stuck. A short scene from a real kind of project, not a tutorial intro.
2. **When** does this apply — Two to four concrete cases, plus one skip. Not an audience list.
3. **How** is it done — The doing. Fenced code, then what to notice, in spoken English. Generous with why.
4. **Watch out for** — Real failure modes only. Omit the heading if there is none. Never invent a filler trap.

Keep the title specific and spoken. Keep `tagline` one spoken line. Keep `description` one sentence for search cards.

## Grounding

Use Athreya’s public work shapes:

- Email-security platform at Mimecast (Angular, micro frontends, Nx monorepo)
- Workflow / email product at Enate (micro frontends, email services)
- This SSG site and the portfolio
- Personal CLIs and side projects
- NGO child-education tools are a side project, not a CV employer

Name Enate and Mimecast the way the CV does. Do not invent internal repo names, real API paths, or threat-engine internals. Do not pull in other CV employers. A second idea is another note.

## Frontmatter

```yaml
title: Short, specific title
tagline: One spoken line for the card.
description: One sentence for search and social cards.
date: "2026-08-24"
updated: "2026-08-24"   # optional; defaults to date
mainTag: angular        # angular | javascript | frontend | micro-front-end | seo | ssr-ssg | node | go | backend | mcp | ai
tags: [frontend]        # extras from that same list only
draft: false
```

- `slug` is the filename. Lowercase kebab-case. URLs are `https://how.athreya.codes/{slug}`.
- `mainTag` is required. Extra `tags` must come from the same list. Typical pairs: `angular` + `frontend`, `javascript` + `frontend`, `node` + `backend`, `go` + `backend`, `mcp` + `ai`. Add `micro-front-end`, `seo`, or `ssr-ssg` when that is the subject.
- If you change the tag list, update `src/app/core/post.ts` and `scripts/content.mjs` together. Chip order on home is `angular, javascript, frontend, micro-front-end, seo, ssr-ssg, node, go, backend, mcp, ai`.
- Social cards use `/images/og-card.jpg` unless `image` is a JPEG, PNG, or WebP.
- `draft: true` stays off production. Local `npm start` still shows it.
- Reserved slugs: `404`, `about`, `search`, `tags`.

Do not invent a second tag vocabulary. No freeform tags like `signals`.

## How section

- Prefer one idea per note. If you need a second idea, that is another note.
- Put code in fences with a language tag. The build adds the label, line numbers, and copy button.
- After a code block, say what to notice. Do not leave the snippet to explain itself.
- Do not add images or tag banners unless the user asks.

## Do not

- Do not write in all caps for emphasis.
- Do not pad with filler ("In today's world…").
- Do not paste API docs. Translate them.
- Do not change portfolio or layers-ui while working on How.
