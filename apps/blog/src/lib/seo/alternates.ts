import type { Locale } from '@repo/core/shared';
import { DEFAULT_LOCALE, LOCALES } from '@repo/core/shared';

import { env } from '~/config/env';

import type { HreflangMap, Pathname } from './types';

/**
 * `basePath: '/blog'` in next.config.mjs only prefixes framework-relative
 * URLs (Link, redirect, static assets) — absolute URLs built manually for
 * metadata (canonical, alternates, openGraph) need '/blog' applied here.
 */
export function buildAlternates(
  pathname: Pathname,
  locale: Locale,
): { canonical: string; languages: HreflangMap } {
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
  };
}
