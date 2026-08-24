import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { POST_TYPES, type PostType } from '../../core/post';
import { Posts } from '../../core/posts';

@Component({
  selector: 'app-home',
  imports: [DatePipe, NgOptimizedImage, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly posts = inject(Posts);

  protected readonly types = POST_TYPES;
  protected readonly tags = this.posts.tags();
  protected readonly type = signal<PostType | null>(null);
  protected readonly tag = signal<string | null>(null);

  protected readonly list = computed(() => {
    const type = this.type();
    const tag = this.tag();

    return this.posts.all.filter((post) => {
      if (type && post.type !== type) {
        return false;
      }

      if (tag && !post.tags.includes(tag)) {
        return false;
      }

      return true;
    });
  });

  protected typeLabel(type: PostType): string {
    return this.posts.typeLabel(type);
  }

  protected toggleType(type: PostType): void {
    this.type.update((current) => (current === type ? null : type));
  }

  protected toggleTag(tag: string): void {
    this.tag.update((current) => (current === tag ? null : tag));
  }
}
