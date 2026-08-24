import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { POST_TYPES, type PostType } from '../../core/post';
import { Posts } from '../../core/posts';
import seoData from '../../data/seo.json';

@Component({
  selector: 'app-home',
  imports: [DatePipe, NgOptimizedImage, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private readonly posts = inject(Posts);

  protected readonly author = seoData.author;
  protected readonly types = POST_TYPES;
  protected readonly type = signal<PostType | null>(null);

  protected readonly list = computed(() => {
    const type = this.type();

    return this.posts.all.filter((post) => !type || post.type === type);
  });

  protected typeLabel(type: PostType): string {
    return this.posts.typeLabel(type);
  }

  protected toggleType(type: PostType): void {
    this.type.update((current) => (current === type ? null : type));
  }
}
