---
name: write-how-note
description: Write and revise notes for the How blog (how.athreya.codes). Use when adding or editing markdown in content/posts, drafting a new How note, or when the user asks to write a blog post, article, or note for How.
---

# Write a How note

Notes live in `content/posts/{slug}.md`. After writing, run `node scripts/content.mjs --drafts` (dev) so the app picks them up.

## Voice

Write like a person talking to a teammate. Short sentences. Plain words. Contractions are fine. Do not sound like a docs site or a conference talk.

Bad: "This approach facilitates crawlable delivery of prerendered artifacts."
Good: "The crawler should get the real page, not an empty shell."

Be generous with explanation. Do not compress a note into a few dense paragraphs. If a step needs a why, write the why.

## Shape

Use these headings, in this order. You can add more after them if the note needs it. Do not skip the first two.

1. **Context** — What were you stuck on? What does the reader already have in front of them?
2. **Where this applies** — Concrete situations. "You want X, and you do not have Y." Not a generic audience list.
3. **How** — The actual walkthrough. Show the code. Say what each bit is doing, in spoken English.
4. Optional: **Watch out for** — Only if there is a real trap.

Keep the title specific. Keep `tagline` one spoken line. Keep `description` one sentence for search cards.

## Frontmatter

```yaml
title: Short, specific title
tagline: One spoken line for the card.
description: One sentence for search and social cards.
date: "2026-08-24"
updated: "2026-08-24"   # optional
mainTag: angular        # angular | mcp | ai | frontend | node | go
tags: [frontend]        # extras from that same list only
image: /images/posts/your-slug/banner.webp  # optional, not shown on the note page
draft: false
```

- `slug` is the filename. Lowercase kebab-case.
- `mainTag` is required. Extra `tags` must come from the same list. A note can be both `angular` and `frontend`.
- `draft: true` stays off production. Local `npm start` still shows it.
- Reserved slugs: `404`, `about`, `search`, `tags`.

Do not invent a second tag vocabulary. No freeform tags like `ssr` or `signals`.

## How section

- Prefer one idea per note. If you need a second idea, that is another note.
- Put code in fences with a language tag. The build adds the label, line numbers, and copy button.
- After a code block, say what to notice. Do not leave the snippet to explain itself.
- Inline images belong in `public/images/posts/{slug}/` and in the markdown body. There is no banner under the date on the note page.

```md
![Alt text](/images/posts/your-slug/diagram.webp)
```

## Do not

- Do not write in all caps for emphasis.
- Do not pad with filler ("In today's world…").
- Do not paste API docs. Translate them.
- Do not change portfolio or layers-ui while working on How.
