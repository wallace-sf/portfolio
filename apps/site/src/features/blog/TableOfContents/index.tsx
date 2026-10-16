'use client';

import type { MarkdownHeading } from '@repo/ui/View';
import classNames from 'classnames';

import { tocTree } from './tocTree';
import { useActiveHeading } from './useActiveHeading';

export interface ITableOfContentsProps {
  headings: MarkdownHeading[];
  label: string;
}

interface ITocLinkProps {
  heading: MarkdownHeading;
  active: boolean;
}

/**
 * The current entry takes its heading's colour, mirroring `.markdown-body`
 * in `@repo/ui` globals.css: h2 is accent (primary under `.light`), h3 is
 * primary. Dark is the default, as before hydration there is no theme class.
 */
const ACTIVE_COLOR: Record<MarkdownHeading['depth'], string> = {
  2: 'text-brand-accent [.light_&]:text-brand-primary',
  3: 'text-brand-primary',
};

const TocLink = ({ heading, active }: ITocLinkProps) => (
  <a
    href={`#${heading.id}`}
    aria-current={active ? 'location' : undefined}
    className={classNames(
      'block py-1 transition-colors hover:text-content-primary motion-reduce:transition-none',
      active
        ? ['font-medium', ACTIVE_COLOR[heading.depth]]
        : 'text-content-secondary',
    )}
  >
    {heading.text}
  </a>
);

/**
 * "On this page": the post's h2/h3 headings as anchor links, with the section
 * being read marked `aria-current="location"` (scrollspy).
 */
export function TableOfContents({ headings, label }: ITableOfContentsProps) {
  const activeId = useActiveHeading(headings.map(({ id }) => id));

  return (
    <nav aria-label={label} className="text-body-sm">
      <ul className="flex flex-col">
        {tocTree(headings).map(({ heading, children }) => (
          <li key={heading.id}>
            <TocLink heading={heading} active={heading.id === activeId} />
            {children.length > 0 && (
              <ul className="flex flex-col border-l border-border-subtle pl-3">
                {children.map((child) => (
                  <li key={child.id}>
                    <TocLink heading={child} active={child.id === activeId} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
