/**
 * The localized name of an archive month (`month` is 1–12), as the locale
 * writes it inside a sentence: "September", "setembro", "septiembre". Pass
 * `capitalized` for a standalone label (a heading, a breadcrumb): "Setembro".
 * Pinned to UTC, the rule the archive groups by, so the 1st of the month never
 * slips into the previous one in negative-offset timezones.
 */
export function formatArchiveMonth(
  year: number,
  month: number,
  locale: string,
  { capitalized = false }: { capitalized?: boolean } = {},
): string {
  const name = new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
  }).format(Date.UTC(year, month - 1, 1));

  return capitalized
    ? name.charAt(0).toLocaleUpperCase(locale) + name.slice(1)
    : name;
}
