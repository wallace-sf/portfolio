'use client';

import { useMemo } from 'react';

import { useSearchState } from '~features/blog/BlogSearch/context';
import { bodyExcerpt } from '~features/blog/search/bodyExcerpt';
import { toSegments } from '~features/blog/search/segments';

export interface ISearchExcerptProps {
  slug: string;
}

/**
 * The matched passage of a post's body, terms marked, while a search is
 * active. Renders nothing without a query, before the index loads, or when
 * the post matched on its card fields only.
 */
export function SearchExcerpt({ slug }: ISearchExcerptProps) {
  const { terms, bodies } = useSearchState();
  const body = bodies[slug];

  const segments = useMemo(() => {
    const excerpt = body ? bodyExcerpt(body, terms) : null;
    return excerpt ? toSegments(excerpt.text, excerpt.marks) : null;
  }, [body, terms]);

  if (!segments) return null;

  return (
    <p className="text-body-sm text-content-secondary">
      {segments.map(({ text, marked }, i) =>
        marked ? (
          // eslint-disable-next-line react/no-array-index-key
          <mark
            key={i}
            className="rounded-sm bg-brand-accent/30 text-content-primary"
          >
            {text}
          </mark>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i}>{text}</span>
        ),
      )}
    </p>
  );
}
