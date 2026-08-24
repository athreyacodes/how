# Adding a note

1. Create `content/posts/your-slug.md` (lowercase kebab-case).
2. Optional images go in `public/images/posts/your-slug/`.
3. Run `npm start` or `npm run build`.

## Frontmatter

```yaml
title: Short, specific title
tagline: One line under the title on the card.
description: One sentence for search and social cards.
date: "2026-08-24"
updated: "2026-08-24"   # optional
mainTag: angular        # angular | mcp | ai | frontend | node | go
tags: [frontend]        # optional extras from the same list
image: /images/posts/your-slug/banner.webp  # optional
draft: false
```

- **slug** is the filename. URLs are `https://how.athreya.codes/your-slug`.
- **mainTag** is required. It is the post's primary tag and must be one of the tags above. If `image` is omitted, the banner in `public/images/tags/{mainTag}.webp` (or `.svg`) is used for social cards. The note page does not show that banner.
- **tags** are extra labels from that same list. A note can be both `angular` and `frontend`. `mainTag` is always included in the generated tag list.
- Write the body like you are talking to a teammate. Start with **Context**, then **Where this applies**, then **How**. Be generous with explanation. The full writing rules are in `.cursor/skills/write-how-note/SKILL.md`.
- **draft: true** is skipped in production builds. `npm start` includes drafts.
- Reserved slugs: `404`, `about`, `search`, `tags`.

Inline images in markdown:

```md
![Alt text](/images/posts/your-slug/diagram.webp)
```

Fenced code gets a language label, line numbers, and a copy button automatically.
