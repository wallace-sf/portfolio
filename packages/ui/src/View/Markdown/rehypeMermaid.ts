import type { Element, ElementContent, Root } from 'hast';

export const MERMAID_TAG = 'mermaid-block';

const isMermaidCode = (node: ElementContent): node is Element =>
  node.type === 'element' &&
  node.tagName === 'code' &&
  Array.isArray(node.properties.className) &&
  node.properties.className.includes('language-mermaid');

const textOf = (node: Element): string =>
  node.children
    .map((child) => (child.type === 'text' ? child.value : ''))
    .join('');

const toMermaidBlock = (code: Element): Element => ({
  type: 'element',
  tagName: MERMAID_TAG,
  properties: { chart: textOf(code) },
  children: [],
});

function transform<T extends Root | Element>(node: T): T {
  const inPre = node.type === 'element' && node.tagName === 'pre';

  return {
    ...node,
    children: node.children.map((child) => {
      if (child.type !== 'element') return child;
      if (inPre && isMermaidCode(child)) return toMermaidBlock(child);
      return transform(child);
    }),
  };
}

/**
 * Swaps the `<code>` of a ```` ```mermaid ```` fence for a `mermaid-block`
 * element (mapped to the `MermaidBlock` client island), keeping the `<pre>`.
 * Runs after sanitization and before `rehype-pretty-code`, which then skips
 * the block because its `<pre>` no longer holds a `<code>`.
 */
export const rehypeMermaid = () => (tree: Root) => transform(tree);
