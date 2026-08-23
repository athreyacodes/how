import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import seoData from '../data/seo.json';

const SITE_URL = seoData.siteUrl.replace(/\/$/, '');

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(): void {
    const config = seoData.home;
    const pageUrl = this.absolute('/');

    this.title.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'robots', content: config.robots });
    this.meta.updateTag({ name: 'author', content: 'Athreya M R' });

    this.meta.updateTag({ property: 'og:site_name', content: seoData.siteName });
    this.meta.updateTag({ property: 'og:title', content: config.ogTitle });
    this.meta.updateTag({ property: 'og:description', content: config.ogDescription });
    this.meta.updateTag({ property: 'og:image', content: this.absolute(config.ogImage) });
    this.meta.updateTag({ property: 'og:image:width', content: String(config.ogImageWidth) });
    this.meta.updateTag({ property: 'og:image:height', content: String(config.ogImageHeight) });
    this.meta.updateTag({ property: 'og:image:alt', content: config.imageAlt });
    this.meta.updateTag({ property: 'og:type', content: config.ogType });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:locale', content: 'en_GB' });

    this.meta.updateTag({ name: 'twitter:card', content: config.twitterCard });
    this.meta.updateTag({ name: 'twitter:title', content: config.twitterTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.twitterDescription });
    this.meta.updateTag({ name: 'twitter:image', content: this.absolute(config.twitterImage) });
    this.meta.updateTag({ name: 'twitter:image:alt', content: config.imageAlt });

    this.setCanonical(pageUrl);
    this.setStructuredData();
  }

  private setStructuredData(): void {
    const websiteId = `${SITE_URL}/#website`;

    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': websiteId,
          name: seoData.siteName,
          description: seoData.home.ogDescription,
          url: `${SITE_URL}/`,
          inLanguage: 'en-GB',
          publisher: {
            '@type': 'Person',
            name: 'Athreya M R',
            url: 'https://athreya.codes/'
          }
        },
        {
          '@type': 'Blog',
          '@id': `${SITE_URL}/#blog`,
          name: seoData.siteName,
          description: seoData.home.description,
          url: `${SITE_URL}/`,
          isPartOf: { '@id': websiteId },
          inLanguage: 'en-GB',
          dateModified: seoData.dateModified
        }
      ]
    };

    this.upsertJsonLd('graph', graph);
  }

  private upsertJsonLd(key: string, schema: Record<string, unknown>): void {
    const selector = `script[type="application/ld+json"][data-seo="${key}"]`;
    const payload = JSON.stringify(schema);
    const existing = this.document.head.querySelector<HTMLScriptElement>(selector);

    if (existing) {
      existing.textContent = payload;
      return;
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', key);
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
