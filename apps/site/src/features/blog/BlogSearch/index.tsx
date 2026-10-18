'use client';

import {
  type ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { useTranslations } from 'next-intl';

import { Link } from '~/i18n/routing';
import { blogTagsPath } from '~features/blog/paths';
import { parseQuery } from '~features/blog/search/parseQuery';
import { rankPosts } from '~features/blog/search/rankPosts';
import type { SearchablePost } from '~features/blog/search/types';

import { type ISearchState, SearchContext } from './context';
import { writeQueryParam } from './queryParam';
import { QuerySync } from './QuerySync';
import { SearchBox } from './SearchBox';
import { useSearchIndex } from './useSearchIndex';

const ALL_POSTS_HEADING_ID = 'all-posts-heading';

export interface IBlogSearchProps {
  locale: string;
  /** Published, newest first: the "All posts" order and the tie-break. */
  posts: SearchablePost[];
  /** Server-rendered cards by slug, each with a `SearchExcerpt` slot. */
  cards: Readonly<Record<string, ReactNode>>;
  /** Sections above "All posts" (featured band, trending tags). */
  before: ReactNode;
  /** Sections below "All posts" (archive navigation). */
  after: ReactNode;
}

/**
 * The listing below its header. With no query it is the listing as it was
 * prerendered: `before`, "All posts", `after`. While searching it shows only
 * the matching cards, best first. It reorders the server-rendered cards and
 * never builds one, so results look exactly like the list.
 */
export function BlogSearch({
  locale,
  posts,
  cards,
  before,
  after,
}: IBlogSearchProps) {
  const t = useTranslations('Blog');
  const [query, setQuery] = useState('');
  const { bodies, load } = useSearchIndex(locale);

  const terms = useMemo(() => parseQuery(query), [query]);
  const searching = terms.length > 0;
  const results = useMemo(
    () => (searching ? rankPosts(posts, bodies, terms) : posts),
    [searching, posts, bodies, terms],
  );
  const state = useMemo<ISearchState>(
    () => ({ terms, bodies }),
    [terms, bodies],
  );

  const changeQuery = useCallback((next: string) => {
    setQuery(next);
    writeQueryParam(next);
  }, []);
  // A shared `/blog?q=…` link searches right away, so load the index now.
  const syncFromUrl = useCallback(
    (fromUrl: string) => {
      setQuery(fromUrl);
      if (parseQuery(fromUrl).length > 0) load();
    },
    [load],
  );

  const list = (
    <ul className="flex flex-col gap-5">
      {results.map(({ slug }) => (
        <li key={slug}>{cards[slug]}</li>
      ))}
    </ul>
  );

  return (
    <SearchContext.Provider value={state}>
      <Suspense fallback={null}>
        <QuerySync onQuery={syncFromUrl} />
      </Suspense>

      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <SearchBox value={query} onChange={changeQuery} onFocus={load} />
          <p aria-live="polite" className="text-body-sm text-content-secondary">
            {searching &&
              t('searchResults', {
                count: results.length,
                query: query.trim(),
              })}
          </p>
        </div>

        {searching ? (
          results.length > 0 ? (
            list
          ) : (
            <p className="text-body-base text-content-secondary">
              {t('searchNoResults')}{' '}
              <Link
                href={blogTagsPath()}
                className="text-brand-primary underline"
              >
                {t('allTags')}
              </Link>
            </p>
          )
        ) : (
          <>
            {before}
            <section
              aria-labelledby={ALL_POSTS_HEADING_ID}
              className="flex flex-col gap-5"
            >
              <h2 id={ALL_POSTS_HEADING_ID} className="text-heading-h4">
                {t('allPosts')}
              </h2>
              {list}
            </section>
            {after}
          </>
        )}
      </div>
    </SearchContext.Provider>
  );
}
