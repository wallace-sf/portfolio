import type { Locale } from '@repo/core/shared';
import { LOCALES } from '@repo/core/shared';

import { SITE_URL } from '~/lib/og';

import type { HreflangMap, Pathname } from './types';

const HREFLANG_DEFAULT_LOCALE: Locale = 'en-US';

export function buildAlternates(
  pathname: Pathname,
  locale: Locale,
): { canonical: string; languages: HreflangMap } {
  const languages = LOCALES.reduce<HreflangMap>(
    (acc, loc) => {
      acc[loc] = `${SITE_URL}/${loc}${pathname}`;
      return acc;
    },
    {
      'x-default': `${SITE_URL}/${HREFLANG_DEFAULT_LOCALE}${pathname}`,
    } as HreflangMap,
  );

  return {
    canonical: `${SITE_URL}/${locale}${pathname}`,
    languages,
  };
}
