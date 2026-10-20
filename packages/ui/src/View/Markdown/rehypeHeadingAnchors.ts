import type { Element, Root } from 'hast';

const LINKED = new Set(['h2', 'h3']);

const anchored = (heading: Element): Element => ({
  ...heading,
  children: [
    {
      type: 'element',
      tagName: 'a',
      properties: {
        href: `#${String(heading.properties.id)}`,
        className: ['heading-anchor'],
      },
      children: heading.children,
    },
  ],
});

function transform<T extends Root | Element>(node: T): T {
  const linked =
    node.type === 'element' &&
    LINKED.has(node.tagName) &&
    node.properties.id !== undefined;

  if (linked) return anchored(node as Element) as T;

  return {
    ...node,
    children: node.children.map((child) =>
      child.type === 'element' ? transform(child) : child,
    ),
  };
}

/**
 * Wraps the content of every h2/h3 in a link to its own `#id`, so a reader can
 * copy a deep link to any section. Wrapping (rather than appending a "#")
 * keeps the heading's accessible name and `markdownHeadings` text unchanged;
 * the visual "#" hint is CSS-only. Runs after `rehype-slug`: the ids, and so
 * the links, are ours, not the author's.
 */
export const rehypeHeadingAnchors = () => (tree: Root) => transform(tree);
