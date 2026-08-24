import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';
import hljs from 'highlight.js';
import { marked } from 'marked';

import seoData from '../src/app/data/seo.json' with { type: 'json' };

const TAGS = ['angular', 'mcp', 'ai', 'frontend', 'node', 'go'];
const RESERVED_SLUGS = new Set(['404', 'about', 'search', 'tags']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'content/posts');
const generatedDir = join(root, 'src/app/generated');
const includeDrafts = process.argv.includes('--drafts');
const siteUrl = seoData.siteUrl.replace(/\/$/, '');

const LANG_ALIASES = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml'
};

function fail(message) {
  console.error(`content: ${message}`);
  process.exit(1);
}

function toDate(value, slug, field) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string' && DATE.test(value)) {
    return value;
  }

  fail(`${slug}: ${field} must be YYYY-MM-DD`);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function highlight(code, lang) {
  const resolved = LANG_ALIASES[lang] ?? lang;

  if (resolved && hljs.getLanguage(resolved)) {
    return hljs.highlight(code, { language: resolved }).value;
  }

  return escapeHtml(code);
}

function wrapLines(html) {
  const lines = html.split('\n');
  return lines
    .map((line) => `<span class="code-block__line">${line.length ? line : '\n'}</span>`)
    .join('\n');
}

function renderFence(code, lang) {
  const label = lang || 'text';
  const highlighted = wrapLines(highlight(code.replace(/\n$/, ''), lang));

  return [
    '<div class="code-block">',
    '<div class="code-block__bar">',
    `<span class="code-block__lang">${escapeHtml(label)}</span>`,
    '<button type="button" class="code-block__copy" data-copy aria-label="Copy code">Copy</button>',
    '</div>',
    `<pre><code class="hljs${lang ? ` language-${escapeHtml(lang)}` : ''}">${highlighted}</code></pre>`,
    `<textarea class="code-block__source" hidden readonly>${escapeHtml(code)}</textarea>`,
    '</div>'
  ].join('');
}

marked.use({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      return renderFence(text, lang);
    }
  }
});

function defaultBanner(tag) {
  const webp = join(root, 'public/images/tags', `${tag}.webp`);
  const svg = join(root, 'public/images/tags', `${tag}.svg`);

  if (existsSync(webp)) {
    return `/images/tags/${tag}.webp`;
  }

  if (existsSync(svg)) {
    return `/images/tags/${tag}.svg`;
  }

  fail(`missing default banner for tag "${tag}" (public/images/tags/${tag}.webp or .svg)`);
}

function normalizeTags(tags, slug, mainTag) {
  if (tags == null) {
    return [mainTag];
  }

  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string' || !tag.trim())) {
    fail(`${slug}: tags must be an array of strings`);
  }

  const extras = [];

  for (const raw of tags) {
    const tag = raw.trim();

    if (!TAGS.includes(tag)) {
      fail(`${slug}: tag "${tag}" must be one of ${TAGS.join(', ')}`);
    }

    if (tag !== mainTag && !extras.includes(tag)) {
      extras.push(tag);
    }
  }

  return [mainTag, ...extras];
}

async function loadPosts() {
  if (!existsSync(postsDir)) {
    fail(`missing ${postsDir}`);
  }

  const names = (await readdir(postsDir)).filter((name) => name.endsWith('.md')).sort();

  if (names.length === 0) {
    fail('no markdown files in content/posts');
  }

  const seen = new Set();
  const posts = [];

  for (const name of names) {
    const slug = name.slice(0, -3);
    const source = await readFile(join(postsDir, name), 'utf8');
    const { data, content } = matter(source);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      fail(`${slug}: slug must be lowercase kebab-case`);
    }

    if (RESERVED_SLUGS.has(slug)) {
      fail(`${slug}: reserved slug`);
    }

    if (seen.has(slug)) {
      fail(`${slug}: duplicate slug`);
    }

    seen.add(slug);

    if (!data.title || typeof data.title !== 'string') {
      fail(`${slug}: title is required`);
    }

    if (!data.description || typeof data.description !== 'string') {
      fail(`${slug}: description is required`);
    }

    const tagline =
      typeof data.tagline === 'string' && data.tagline.trim()
        ? data.tagline.trim()
        : data.description.trim();

    const date = toDate(data.date, slug, 'date');
    const updated = data.updated == null ? date : toDate(data.updated, slug, 'updated');

    if (!TAGS.includes(data.mainTag)) {
      fail(`${slug}: mainTag must be one of ${TAGS.join(', ')}`);
    }

    if (data.image != null && (typeof data.image !== 'string' || !data.image.startsWith('/'))) {
      fail(`${slug}: image must be a root-relative path`);
    }

    const draft = Boolean(data.draft);

    if (draft && !includeDrafts) {
      continue;
    }

    const html = marked.parse(content.trim(), { async: false });
    const banner = data.image || defaultBanner(data.mainTag);

    posts.push({
      slug,
      title: data.title.trim(),
      tagline,
      description: data.description.trim(),
      date,
      updated,
      mainTag: data.mainTag,
      tags: normalizeTags(data.tags, slug, data.mainTag),
      image: data.image ?? null,
      banner,
      draft,
      html
    });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  return posts;
}

function sitemapXml(posts) {
  const urls = [
    {
      loc: `${siteUrl}/`,
      lastmod: posts[0]?.updated ?? seoData.dateModified,
      changefreq: 'weekly',
      priority: '1.0'
    },
    ...posts.map((post) => ({
      loc: `${siteUrl}/${post.slug}`,
      lastmod: post.updated,
      changefreq: 'monthly',
      priority: '0.8'
    }))
  ];

  const body = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

const posts = await loadPosts();
const listing = posts.map(({ html, ...meta }) => meta);
const bodies = Object.fromEntries(posts.map((post) => [post.slug, post.html]));

await mkdir(generatedDir, { recursive: true });
await writeFile(
  join(generatedDir, 'posts.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), posts: listing }, null, 2)}\n`
);
await writeFile(join(generatedDir, 'bodies.json'), `${JSON.stringify(bodies)}\n`);
await writeFile(join(root, 'public/sitemap.xml'), sitemapXml(listing));

console.log(`content: ${posts.length} post(s)${includeDrafts ? ' (drafts included)' : ''}`);
