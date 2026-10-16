import type { MarkdownHeading } from '@repo/ui/View';

export interface ITocEntry {
  heading: MarkdownHeading;
  children: MarkdownHeading[];
}

/**
 * Groups each h3 under the h2 before it. An h3 with no h2 before it stays at
 * the top level, so no heading is dropped.
 */
export const tocTree = (headings: MarkdownHeading[]): ITocEntry[] =>
  headings.reduce<ITocEntry[]>((entries, heading) => {
    const parent = entries.at(-1);
    const nests = heading.depth === 3 && parent?.heading.depth === 2;

    return nests
      ? [
          ...entries.slice(0, -1),
          { ...parent, children: [...parent.children, heading] },
        ]
      : [...entries, { heading, children: [] }];
  }, []);
