# How

[how.athreya.codes](https://how.athreya.codes) — notes on how Athreya codes.

Angular 22 SSG app with a layers-ui wave background.

## Stack

- Angular 22 (static prerender / SSG)
- [layers-ui](https://github.com/athreyacodes/layers-ui) for the animated cloud background
- Firebase Hosting project `how-athreya-codes` (custom domain `how.athreya.codes`)

## Development

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

## Production build

```bash
npm run build
```

Output: `dist/how/browser`

## Deploy

Merges to `main` deploy to Firebase Hosting via GitHub Actions.
