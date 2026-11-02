// pandoc emits headerless tables for `|   |   |` header rows; drop empty <thead> to match.
import { visit } from 'unist-util-visit';

const text = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));

export default function rehypeEmptyThead() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'thead' && text(node).trim() === '' && parent) {
        parent.children.splice(index, 1);
        return ['skip', index];
      }
    });
  };
}
