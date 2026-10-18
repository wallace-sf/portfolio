import { useCallback, useRef, useState } from 'react';

import { blogSearchIndexPath } from '~features/blog/paths';
import type { SearchBodies } from '~features/blog/search/types';

type SearchEntry = { slug: string; text: string };

const isEntry = (value: unknown): value is SearchEntry =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as SearchEntry).slug === 'string' &&
  typeof (value as SearchEntry).text === 'string';

const toBodies = (entries: unknown): SearchBodies =>
  Array.isArray(entries)
    ? Object.fromEntries(
        entries.filter(isEntry).map(({ slug, text }) => [slug, text]),
      )
    : {};

/**
 * The search index bodies, fetched once, on the first `load()`. Until then,
 * and if the request fails (logged, never shown), `bodies` stays empty and the
 * search matches card fields only.
 */
export function useSearchIndex(locale: string): {
  bodies: SearchBodies;
  load: () => void;
} {
  const [bodies, setBodies] = useState<SearchBodies>({});
  const requested = useRef(false);

  const load = useCallback(() => {
    if (requested.current) return;
    requested.current = true;

    // `fetch` doesn't add the locale prefix the way `Link` does.
    fetch(`/${locale}${blogSearchIndexPath()}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((entries) => setBodies(toBodies(entries)))
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('[blog search] could not load the index:', error);
      });
  }, [locale]);

  return { bodies, load };
}
