import { DEFAULT_LOCALE, LOCALES, type Locale } from '@repo/core/shared';

import type {
  IAlternatesResult,
  HreflangMap,
  IOpenGraphResult,
  IRobotsResult,
  Pathname,
  ISeoBuilders,
  ISeoBuildersConfig,
} from './types';

/**
 * Builds a `{ buildAlternates, buildOpenGraph }` pair pre-bound to one app's
 * `siteUrl`/`basePath`/RSS feed, so call sites only pass `pathname`/`locale`.
 *
 * `basePath` (e.g. Next.js's `basePath: '/blog'`) is applied manually here
 * because it only prefixes framework-relative URLs (Link, redirect, static
 * assets) — absolute URLs built for metadata (canonical, alternates,
 * openGraph) are plain strings Next.js never touches.
 *
 * The RSS `types` entry lives inside `buildAlternates`, not a separate call
 * site, because Next.js does not deep-merge `alternates` between layout and
 * page metadata (the same limitation apps already document for `openGraph`)
 * — a page-level `generateMetadata` silently replaces whatever the layout
 * set. Every page already calls `buildAlternates` for canonical/hreflang, so
 * folding the feed link in here guarantees it survives regardless of which
 * metadata "wins".
 */
export function createSeoBuilders(config: ISeoBuildersConfig): ISeoBuilders {
  const { siteUrl, siteName, rssFeed } = config;
  const basePath = config.basePath ?? '';

  function buildAlternates(
    pathname: Pathname,
    locale: Locale,
  ): IAlternatesResult {
    const languages = LOCALES.reduce<HreflangMap>(
      (acc, loc) => {
        acc[loc] = `${siteUrl}${basePath}/${loc}${pathname}`;
        return acc;
      },
      {
        'x-default': `${siteUrl}${basePath}/${DEFAULT_LOCALE}${pathname}`,
      } as HreflangMap,
    );

    return {
      canonical: `${siteUrl}${basePath}/${locale}${pathname}`,
      languages,
      ...(rssFeed && {
        types: {
          'application/rss+xml': [
            {
              url: `${siteUrl}${basePath}/${locale}/${rssFeed.filename}`,
              title: rssFeed.title,
            },
          ],
        },
      }),
    };
  }

  function buildOpenGraph(
    locale: Locale,
    pathname: Pathname,
    type: 'website' | 'article' = 'website',
  ): IOpenGraphResult {
    return {
      type,
      url: `${siteUrl}${basePath}/${locale}${pathname}`,
      locale,
      siteName,
    };
  }

  function buildRobots(): IRobotsResult {
    return {
      rules: { userAgent: '*', allow: '/' },
      sitemap: `${siteUrl}${basePath}/sitemap.xml`,
    };
  }

  return { buildAlternates, buildOpenGraph, buildRobots };
}
