import { DEFAULT_LOCALE, Locale, isLocale } from '@repo/core/shared';

export function resolveLocale(request: Request): Locale {
  const url = new URL(request.url);
  const queryLocale = url.searchParams.get('locale');
  if (queryLocale && isLocale(queryLocale)) return queryLocale;

  const acceptLanguage = request.headers.get('Accept-Language') ?? '';
  const candidates = acceptLanguage
    .split(',')
    .map((s) => (s.split(';')[0] ?? '').trim());
  for (const candidate of candidates) {
    if (isLocale(candidate)) return candidate;
  }

  return DEFAULT_LOCALE;
}
