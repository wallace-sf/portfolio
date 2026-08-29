import { isLocale, type Locale } from '@repo/core/shared';

export type Zone = 'site' | 'blog';

const ZONE_BASE_PATH: Record<Zone, string> = {
  site: '',
  blog: '/blog',
};

/**
 * Builds a URL for navigating between the `site` and `blog` multi-zone
 * deployments, always embedding the current locale in the path.
 *
 * Each zone resolves locale independently (separate `NEXT_LOCALE` cookies
 * scoped by basePath) — a link built without an explicit locale segment
 * silently drops the user's language when it crosses the zone boundary.
 * Every cross-zone link must go through this helper instead of ad hoc
 * string concatenation.
 */
export function buildCrossZoneHref(
  targetZone: Zone,
  locale: Locale,
  path = '',
): string {
  if (!isLocale(locale)) {
    throw new Error(`buildCrossZoneHref: invalid locale "${locale}"`);
  }
  if (path !== '' && !path.startsWith('/')) {
    throw new Error(
      `buildCrossZoneHref: path must start with "/" or be empty, got "${path}"`,
    );
  }

  return `${ZONE_BASE_PATH[targetZone]}/${locale}${path}`;
}
