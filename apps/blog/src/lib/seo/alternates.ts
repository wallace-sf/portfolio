import type { Locale } from '@repo/core/shared';
import { DEFAULT_LOCALE, LOCALES } from '@repo/core/shared';

import { env } from '~/config/env';

import type { HreflangMap, Pathname, RssTypeMap } from './types';

/**
 * `basePath: '/blog'` in next.config.mjs only prefixes framework-relative
 * URLs (Link, redirect, static assets) — absolute URLs built manually for
 * metadata (canonical, alternates, openGraph) need '/blog' applied here.
 *
 * The RSS `types` entry lives here, not in a separate call site, because
 * Next.js does not deep-merge `alternates` between layout and page
 * metadata — whichever generateMetadata runs last fully replaces it. Every
 * page calls buildAlternates for canonical/hreflang anyway, so folding the
 * feed link in here guarantees it survives regardless of which metadata
 * "wins".
 */
export function buildAlternates(
  pathname: Pathname,
  locale: Locale,
): { canonical: string; languages: HreflangMap; types: RssTypeMap } {
  const languages = LOCALES.reduce<HreflangMap>(
    (acc, loc) => {
      acc[loc] = `${env.siteUrl}/blog/${loc}${pathname}`;
      return acc;
    },
    {
      'x-default': `${env.siteUrl}/blog/${DEFAULT_LOCALE}${pathname}`,
    } as HreflangMap,
  );

  return {
    canonical: `${env.siteUrl}/blog/${locale}${pathname}`,
    languages,
    types: {
      'application/rss+xml': [
        {
          url: `${env.siteUrl}/blog/${locale}/rss.xml`,
          title: 'Wallace Ferreira — Blog',
        },
      ],
    },
  };
}
