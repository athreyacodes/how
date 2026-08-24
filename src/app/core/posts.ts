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

  extraTags(post: Post): readonly Tag[] {
    return post.tags.filter((tag) => tag !== post.mainTag);
  }

  newestUpdated(): string | undefined {
    return this.all[0]?.updated;
  }
}
