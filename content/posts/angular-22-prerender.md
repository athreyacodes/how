---
title: Angular 22 prerender without the ceremony
tagline: So search engines see the page, not a shell.
description: How to ship crawlable Angular pages with outputMode static, a resolver for metadata, and no CMS.
date: "2026-08-24"
mainTag: angular
tags: [frontend]
image: /images/posts/angular-22-prerender/banner.svg
draft: false
---

Search and social crawlers should receive the page, not an empty shell. Angular 22 can prerender that HTML at build time. The route still looks like a normal standalone component.

Keep metadata in a resolver so the tags exist in the static file:

```ts
export const postSeoResolver: ResolveFn<boolean> = (route) => {
  const post = inject(Posts).bySlug(route.paramMap.get('slug') ?? '');

  if (post) {
    inject(SeoService).applyPost(post);
  }

  return true;
};
```

The build discovers slugs from markdown, then prerenders each `/:slug` path. Adding a note is a file, not a dashboard.

![Markdown becomes prerendered HTML at build time](/images/posts/angular-22-prerender/prerender-flow.svg)

Parameterized SSG needs `getPrerenderParams`. That function returns the slug list the builder should bake:

```ts
{
  path: ':slug',
  renderMode: RenderMode.Prerender,
  fallback: PrerenderFallback.None,
  async getPrerenderParams() {
    return inject(Posts).all.map((post) => ({ slug: post.slug }));
  }
}
```

`PrerenderFallback.None` is the right call for a static host: unknown slugs should 404, not try to render on a server you do not have.
