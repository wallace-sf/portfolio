import type { Locale } from '@repo/core/shared';
import { DEFAULT_LOCALE, LOCALES } from '@repo/core/shared';

import { env } from '~/config/env';

import type { HreflangMap, Pathname } from './types';

export function buildAlternates(
  pathname: Pathname,
  locale: Locale,
): { canonical: string; languages: HreflangMap } {
  const languages = LOCALES.reduce<HreflangMap>(
    (acc, loc) => {
      acc[loc] = `${env.siteUrl}/${loc}${pathname}`;
      return acc;
    },
    {
      'x-default': `${env.siteUrl}/${DEFAULT_LOCALE}${pathname}`,
    } as HreflangMap,
  );

  return {
    canonical: `${env.siteUrl}/${locale}${pathname}`,
    languages,
  };
}
