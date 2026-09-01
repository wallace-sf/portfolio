/**
 * Formats a post's `publishedAt` — a date-only string (`YYYY-MM-DD`) — for the
 * given locale. Pinned to UTC so it isn't shifted to the previous day in
 * negative-offset timezones.
 */
export function formatPublishedAt(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}
