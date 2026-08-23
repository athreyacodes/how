# Blogs

A minimal Angular 22 SSG app with a layers-ui wave background — ready for blog routes to be added later.

## Stack

- Angular 22 (static prerender / SSG)
- [layers-ui](https://github.com/athreyacodes/layers-ui) for the animated cloud background
- Firebase Hosting (`blogs-99980`)

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

Output: `dist/blogs/browser`

## Deploy

Merges to `main` deploy to Firebase Hosting (`blogs-99980`) via GitHub Actions.
