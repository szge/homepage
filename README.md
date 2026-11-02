Personal site built with [Astro](https://astro.build). Posts are Markdown with
KaTeX math (`$...$`, `$$...$$`) and raw HTML/`<script>`/`<style>` allowed.

## Local development

Requires Node >= 22.12.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview
```

## Writing a post

Add `src/content/blog/<slug>.md` with a `title` in the frontmatter:

```
---
title: "My Post"
---
```

It is published at `/blog/<slug>.html`. Put images in `public/blog/images/` and
reference them as `/blog/images/...`; an image alone on a line becomes a
`<figure>` with its alt text as the caption. Escape literal dollar signs as `\$`.
Then link the post from `src/pages/index.astro`.

## Production (Vercel)

Vercel auto-detects Astro (`npm run build`, output `dist/`). Only `dist/` is deployed.
