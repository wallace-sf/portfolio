import { isLocale, type Locale } from '@repo/core/shared';

export type Zone = 'site' | 'blog';

const ZONE_BASE_PATH: Record<Zone, string> = {
  site: '',
  blog: '/blog',
};

/**
 * Builds an **absolute** URL for navigating between the `site` and `blog`
 * multi-zone deployments, always embedding the current locale in the path.
 *
 * Why absolute: the two zones are separate Next.js apps served under one
 * domain via a rewrite. A bare path (`/en-US`) handed to `next/link` inside
 * the `blog` app is silently rewritten to `/blog/en-US` by its `basePath` —
 * so cross-zone links must be full URLs, which `next/link` treats as external
 * (no `basePath` munging, no broken cross-app client routing). It also keeps
 * the locale explicit so language is never dropped at the zone boundary
 * (each zone scopes its own `NEXT_LOCALE` cookie by `basePath`).
 *
 * The origin comes from `NEXT_PUBLIC_SITE_URL` (the shared public domain),
 * falling back to the site's local dev server.
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

  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ).replace(/\/$/, '');

  return `${origin}${ZONE_BASE_PATH[targetZone]}/${locale}${path}`;
}
