import type { Locale } from '@repo/core/shared';

import { env } from '~/config/env';

import type { Pathname } from './types';

interface BaseOpenGraph {
  type: 'website' | 'article';
  url: string;
  locale: Locale;
  siteName: string;
}

/**
 * Base Open Graph fields shared by every page. Next.js does not deep-merge
 * `openGraph` between layout and page metadata — a page-level `openGraph`
 * fully replaces the layout's, so `type`/`url`/`locale` must be re-applied
 * on every page rather than declared once in the root layout.
 */
export function buildOpenGraph(
  locale: Locale,
  pathname: Pathname,
  type: 'website' | 'article' = 'website',
): BaseOpenGraph {
  return {
    type,
    url: `${env.siteUrl}/${locale}${pathname}`,
    locale,
    siteName: 'Wallace Ferreira',
  };
}
