# How

[how.athreya.codes](https://how.athreya.codes) — notes on how Athreya codes.

Angular 22 SSG. Notes are markdown files; the build prerenders each page.

## Stack

- Angular 22 (static prerender / SSG)
- [layers-ui](https://github.com/athreyacodes/layers-ui) for tokens and the cloud background
- Firebase Hosting project `how-athreya-codes` (custom domain `how.athreya.codes`)

## Add a note

See [content/README.md](content/README.md). Short version: add `content/posts/your-slug.md`, then `npm start` or `npm run build`.

## Development

```bash
npm install
npm start
```

Open `http://localhost:4200/`. Drafts are included locally.

## Production build

```bash
npm run build
```

Output: `dist/how/browser`. Drafts are omitted.

## Deploy

Merges to `main` deploy to Firebase Hosting via GitHub Actions.
