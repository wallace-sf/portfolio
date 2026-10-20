import type { Element, Root } from 'hast';

export const ZOOMABLE_IMAGE_TAG = 'zoomable-image';

const toZoomable = (image: Element): Element => ({
  ...image,
  tagName: ZOOMABLE_IMAGE_TAG,
});

function transform<T extends Root | Element>(node: T): T {
  // A linked image keeps its link: a zoom button inside <a> would be invalid
  // and would swallow the click.
  if (node.type === 'element' && node.tagName === 'a') return node;

  return {
    ...node,
    children: node.children.map((child) => {
      if (child.type !== 'element') return child;
      if (child.tagName === 'img') return toZoomable(child);
      return transform(child);
    }),
  };
}

/**
 * Renames every Markdown `<img>` outside a link to a `zoomable-image` element
 * (mapped to the `ZoomableImage` client island), keeping its attributes — the
 * lazy-loading hints included, so it runs after `rehypeLazyImages`.
 */
export const rehypeZoomableImages = () => (tree: Root) => transform(tree);
