import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TAGS, type Post, type Tag } from '../../core/post';
import { Posts } from '../../core/posts';
import seoData from '../../data/seo.json';

@Component({
  selector: 'app-home',
  imports: [DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly posts = inject(Posts);

  protected readonly author = seoData.author;
  protected readonly tags = TAGS;
  protected readonly tag = signal<Tag | null>(null);

  protected readonly list = computed(() => {
    const tag = this.tag();

    return this.posts.all.filter((post) => !tag || post.tags.includes(tag));
  });

  protected tagLabel(tag: Tag): string {
    return this.posts.tagLabel(tag);
  }

  protected extraTags(post: Post): readonly Tag[] {
    return this.posts.extraTags(post);
  }

  protected toggleTag(tag: Tag): void {
    this.tag.update((current) => (current === tag ? null : tag));
  }
}
