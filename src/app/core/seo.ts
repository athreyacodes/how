import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import seoData from '../data/seo.json';
import { TAG_LABELS, type Post } from './post';

const SITE_URL = seoData.siteUrl.replace(/\/$/, '');
const INDEX_ROBOTS = seoData.robots;

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  imageAlt?: string;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  applyHome(dateModified?: string): void {
    const config = seoData.home;

    this.applyTags({
      title: config.title,
      description: config.description,
      path: '/',
      ogType: config.ogType,
      ogImage: config.ogImage,
      imageAlt: config.imageAlt
    });

    this.setStructuredData(this.homeGraph(dateModified ?? seoData.dateModified));
  }

  applyPost(post: Post): void {
    const title = `${post.title} · How`;
    const imageAlt = `${post.title} — ${TAG_LABELS[post.mainTag]}`;

    this.applyTags({
      title,
      description: post.description,
      path: `/${post.slug}`,
      ogType: 'article',
      ogImage: post.banner,
      imageAlt
    });

    this.meta.updateTag({ property: 'article:published_time', content: post.date });
    this.meta.updateTag({ property: 'article:modified_time', content: post.updated });
    this.meta.updateTag({ property: 'article:author', content: seoData.author });
    this.meta.updateTag({ property: 'article:section', content: TAG_LABELS[post.mainTag] });

    this.setStructuredData(this.postGraph(post, title, imageAlt));
  }

  applyNotFound(): void {
    const config = seoData.notFound;

    this.applyTags({
      title: config.title,
      description: config.description,
      path: '/404',
      robots: config.robots,
      ogType: config.ogType,
      ogImage: config.ogImage,
      imageAlt: config.imageAlt
    });

    this.setStructuredData(null);
  }

  private applyTags(page: PageSeo): void {
    const pageUrl = this.absolute(page.path);
    const image = this.absolute(page.ogImage ?? seoData.home.ogImage);
    const imageAlt = page.imageAlt ?? seoData.home.imageAlt;
    const robots = page.robots ?? INDEX_ROBOTS;

    this.title.setTitle(page.title);

    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ name: 'author', content: seoData.author });

    this.meta.updateTag({ property: 'og:site_name', content: seoData.siteName });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: String(seoData.ogImageWidth) });
    this.meta.updateTag({ property: 'og:image:height', content: String(seoData.ogImageHeight) });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({ property: 'og:type', content: page.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:locale', content: 'en_GB' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });

    this.setCanonical(pageUrl);
  }

  private homeGraph(dateModified: string): Record<string, unknown> {
    const websiteId = `${SITE_URL}/#website`;
    const personId = `${SITE_URL}/#person`;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        this.personNode(personId),
        {
          '@type': 'WebSite',
          '@id': websiteId,
          name: seoData.siteName,
          description: seoData.home.ogDescription,
          url: `${SITE_URL}/`,
          inLanguage: 'en-GB',
          publisher: { '@id': personId }
        },
        {
          '@type': 'Blog',
          '@id': `${SITE_URL}/#blog`,
          name: seoData.siteName,
          description: seoData.home.description,
          url: `${SITE_URL}/`,
          isPartOf: { '@id': websiteId },
          inLanguage: 'en-GB',
          dateModified,
          author: { '@id': personId }
        }
      ]
    };
  }

  private postGraph(post: Post, title: string, imageAlt: string): Record<string, unknown> {
    const websiteId = `${SITE_URL}/#website`;
    const personId = `${SITE_URL}/#person`;
    const pageUrl = this.absolute(`/${post.slug}`);
    const image = this.absolute(post.banner);

    return {
      '@context': 'https://schema.org',
      '@graph': [
        this.personNode(personId),
        {
          '@type': 'BlogPosting',
          '@id': `${pageUrl}#post`,
          headline: post.title,
          name: title,
          description: post.description,
          url: pageUrl,
          image: {
            '@type': 'ImageObject',
            url: image,
            width: seoData.ogImageWidth,
            height: seoData.ogImageHeight,
            caption: imageAlt
          },
          datePublished: post.date,
          dateModified: post.updated,
          inLanguage: 'en-GB',
          author: { '@id': personId },
          publisher: { '@id': personId },
          isPartOf: { '@id': `${SITE_URL}/#blog` },
          mainEntityOfPage: pageUrl,
          keywords: post.tags.map((tag) => TAG_LABELS[tag]).join(', '),
          articleSection: TAG_LABELS[post.mainTag]
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          name: seoData.siteName,
          url: `${SITE_URL}/`
        }
      ]
    };
  }

  private personNode(personId: string): Record<string, unknown> {
    return {
      '@type': 'Person',
      '@id': personId,
      name: seoData.author,
      url: seoData.authorUrl
    };
  }

  private setStructuredData(schema: Record<string, unknown> | null): void {
    const selector = 'script[type="application/ld+json"][data-seo="graph"]';
    const existing = this.document.head.querySelector<HTMLScriptElement>(selector);

    if (!schema) {
      existing?.remove();
      return;
    }

    const payload = JSON.stringify(schema);

    if (existing) {
      existing.textContent = payload;
      return;
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'graph');
    script.textContent = payload;
    this.document.head.appendChild(script);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private absolute(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return `${SITE_URL}/${path.replace(/^\//, '')}`;
  }
}
