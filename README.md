# aboxho.com

Machine-readable personal site for Antoine Boxho, inspired by [jeroen.md](https://jeroen.md/).

The homepage is a minimal intro. The meat of the site is the plain text / markdown context files designed to be fed to LLMs and AI agents:

- `/llms.txt` — short index of context pages.
- `/llms-full.txt` — everything in one file.
- `/about.md`, `/experience.md`, `/education.md`, `/working-with-me.md`, `/writing-about.md`, `/contact.md` — focused context pages.

## Stack

Vite + TypeScript, no framework. Markdown and text context files are served as static assets from `public/`.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy (Firebase Hosting)

```bash
npm run deploy
```
