# Adding a note

1. Create `content/posts/your-slug.md` (lowercase kebab-case).
2. Optional images go in `public/images/posts/your-slug/`.
3. Run `npm start` or `npm run build`.

## Frontmatter

```yaml
title: Short, specific title
description: One sentence for search and social cards.
date: "2026-08-24"
updated: "2026-08-24"   # optional
type: angular         # angular | mcp | ai | frontend | node | go
tags: [ssr, prerender]
image: /images/posts/your-slug/banner.webp  # optional
draft: false
```

- **slug** is the filename. URLs are `https://how.athreya.codes/your-slug`.
- **type** is required. If `image` is omitted, the type banner in `public/images/types/{type}.webp` (or `.svg`) is used.
- **draft: true** is skipped in production builds. `npm start` includes drafts.
- Reserved slugs: `404`, `about`, `search`, `tags`.

Inline images in markdown:

```md
![Alt text](/images/posts/your-slug/diagram.webp)
```

Fenced code gets a language label, line numbers, and a copy button automatically.
