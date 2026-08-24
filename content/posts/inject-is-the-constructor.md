---
title: inject() is the constructor now
tagline: Skip the constructor. Keep state in a signal.
description: A standalone component can take what it needs with inject. Local UI state belongs in a signal.
date: "2026-08-20"
type: angular
tags: [inject, signals]
draft: false
---

You do not need a constructor to wire a standalone component. `inject` reads the token at creation time, the same as a parameter would have:

```ts
export class Home {
  private readonly posts = inject(Posts);
  protected readonly type = signal<PostType | null>(null);
}
```

Keep UI state in a signal so the template can stay a read of current values. A `computed` list is enough when the filter is local:

```ts
protected readonly list = computed(() => {
  const type = this.type();
  return this.posts.all.filter((post) => !type || post.type === type);
});
```

`OnInit` is unused here. The route already resolved what the page needs; the component only holds what the user just changed.
