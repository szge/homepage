import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkFigure from './plugins/remark-figure.mjs';
import rehypeEmptyThead from './plugins/rehype-empty-thead.mjs';

export default defineConfig({
  site: 'https://jonathanchiang.ca',
  // Keep the old URLs: /blog/<slug>.html and /index.html
  build: { format: 'file' },
  trailingSlash: 'never',
  markdown: {
    remarkPlugins: [remarkMath, remarkFigure],
    rehypePlugins: [rehypeKatex, rehypeEmptyThead],
    syntaxHighlight: false,
  },
});
