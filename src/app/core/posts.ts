import { Injectable } from '@angular/core';

import generated from '../generated/posts.json';
import { TAGS, TAG_LABELS, type Post, type PostsFile, type Tag } from './post';

const data = generated as PostsFile;

@Injectable({ providedIn: 'root' })
export class Posts {
  readonly all: readonly Post[] = data.posts;

  bySlug(slug: string): Post | undefined {
    return this.all.find((post) => post.slug === slug);
  }

  tags(): readonly Tag[] {
    return TAGS;
  }

  tagLabel(tag: Tag): string {
    return TAG_LABELS[tag];
  }

  similar(post: Post, limit = 5): readonly Post[] {
    return this.all
      .filter(
        (other) =>
          other.slug !== post.slug && other.tags.some((tag) => post.tags.includes(tag))
      )
      .sort((a, b) => {
        const shared = (item: Post) => item.tags.filter((tag) => post.tags.includes(tag)).length;
        return shared(b) - shared(a) || b.date.localeCompare(a.date);
      })
      .slice(0, limit);
  }

  newestUpdated(): string | undefined {
    return this.all[0]?.updated;
  }
}
