// Mimics pandoc's `implicit_figures`: an image alone in a paragraph becomes
// <figure><img><figcaption>alt text (with inline markdown)</figcaption></figure>.
import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';

// Minimal smart-quote pass for caption text (smartypants doesn't see alt text).
const curl = (s) =>
  s
    .replace(/(^|[\s(\[\u201c])"/g, '$1\u201c').replace(/"/g, '\u201d')
    .replace(/(^|[\s(\[\u201c])'/g, '$1\u2018').replace(/'/g, '\u2019');

export default function remarkFigure() {
  return (tree, file) => {
    const src = String(file.value ?? '');
    visit(tree, 'paragraph', (node) => {
      if (node.children.length !== 1 || node.children[0].type !== 'image') return;
      const img = node.children[0];
      let caption = img.alt ? [{ type: 'text', value: img.alt }] : [];
      // Recover the raw alt text so inline formatting/links survive.
      const start = img.position?.start.offset;
      const end = img.position?.end.offset;
      if (start != null && end != null) {
        const raw = src.slice(start, end);
        const close = raw.lastIndexOf('](');
        if (raw.startsWith('![') && close > 1) {
          const alt = raw.slice(2, close);
          if (alt.trim()) {
            const parsed = fromMarkdown(alt).children[0];
            if (parsed?.children) caption = parsed.children;
          }
        }
      }
      visit({ type: 'root', children: caption }, 'text', (t) => { t.value = curl(t.value); });
      img.alt = curl(img.alt ?? '');
      node.data = { hName: 'figure' };
      node.children = [
        img,
        ...(caption.length
          ? [{ type: 'paragraph', data: { hName: 'figcaption' }, children: caption }]
          : []),
      ];
    });
  };
}
