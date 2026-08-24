import { Injectable } from '@angular/core';

import generated from '../generated/posts.json';
import { POST_TYPES, POST_TYPE_LABELS, type Post, type PostType, type PostsFile } from './post';

const data = generated as PostsFile;

@Injectable({ providedIn: 'root' })
export class Posts {
  readonly all: readonly Post[] = data.posts;

  bySlug(slug: string): Post | undefined {
    return this.all.find((post) => post.slug === slug);
  }

  types(): readonly PostType[] {
    return POST_TYPES;
  }

  typeLabel(type: PostType): string {
    return POST_TYPE_LABELS[type];
  }

  tags(): readonly string[] {
    return [...new Set(this.all.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
  }

  newestUpdated(): string | undefined {
    return this.all[0]?.updated;
  }
}
