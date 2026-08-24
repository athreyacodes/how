import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import type { Post, Tag } from '../../core/post';
import { Posts } from '../../core/posts';
import bodies from '../../generated/bodies.json';

@Component({
  selector: 'app-post',
  imports: [DatePipe, RouterLink],
  templateUrl: './post.html',
  styleUrl: './post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PostPage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly posts = inject(Posts);
  readonly post = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => data['post'] as Post)),
    { requireSync: true }
  );

  protected readonly html = computed(() => {
    const body = (bodies as Record<string, string>)[this.post().slug] ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(body);
  });

  protected readonly similar = computed(() => this.posts.similar(this.post()));

  protected tagLabel(tag: Tag): string {
    return this.posts.tagLabel(tag);
  }

  protected copyCode(event: Event): void {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>('[data-copy]');

    if (!button) {
      return;
    }

    const source = button.closest('.code-block')?.querySelector<HTMLTextAreaElement>('.code-block__source');
    const text = source?.value;

    if (!text) {
      return;
    }

    void navigator.clipboard.writeText(text).then(() => {
      const previous = button.textContent;
      button.textContent = 'Copied';
      window.setTimeout(() => {
        button.textContent = previous ?? 'Copy';
      }, 1600);
    });
  }
}
