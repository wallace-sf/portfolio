import type { Element, ElementContent, Root } from 'hast';

import { markdownToHast } from './pipeline';

export type MarkdownHeading = { id: string; text: string; depth: 2 | 3 };

const DEPTHS: Record<string, MarkdownHeading['depth']> = { h2: 2, h3: 3 };

const isElement = (node: { type: string }): node is Element =>
  node.type === 'element';

/** Text content with inline markup (code, emphasis, links) flattened. */
const textOf = (node: ElementContent): string =>
  node.type === 'text'
    ? node.value
    : isElement(node)
      ? node.children.map(textOf).join('')
      : '';

const headingsIn = (node: Root | Element): MarkdownHeading[] =>
  (node.children as { type: string }[]).filter(isElement).flatMap((child) => {
    const depth = DEPTHS[child.tagName];
    if (!depth) return headingsIn(child);

    return [{ id: String(child.properties.id), text: textOf(child), depth }];
  });

/**
 * The h2/h3 headings of `markdown`, in document order, with the ids the
 * rendered body carries — both come from the same (cached) pipeline run.
 */
export async function markdownHeadings(
  markdown: string,
): Promise<MarkdownHeading[]> {
  return headingsIn(await markdownToHast(markdown));
}
