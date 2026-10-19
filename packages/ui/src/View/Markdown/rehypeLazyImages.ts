import type { Element, Root } from 'hast';

function transform<T extends Root | Element>(node: T): T {
  const lazy =
    node.type === 'element' && node.tagName === 'img'
      ? {
          properties: {
            ...node.properties,
            loading: 'lazy',
            decoding: 'async',
          },
        }
      : {};

  return {
    ...node,
    ...lazy,
    children: node.children.map((child) =>
      child.type === 'element' ? transform(child) : child,
    ),
  };
}

/**
 * Marks every Markdown `<img>` as `loading="lazy"` and `decoding="async"`, so
 * figures below the fold don't compete with the first paint. Runs after
 * sanitization: the attributes are ours, not the author's.
 */
export const rehypeLazyImages = () => (tree: Root) => transform(tree);
