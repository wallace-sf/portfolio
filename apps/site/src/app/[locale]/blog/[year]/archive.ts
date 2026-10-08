import {
  type BlogArchiveYearDTO,
  ListBlogArchive,
} from '@repo/application/blog';
import { DEFAULT_LOCALE, LOCALES } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';
import { monthSegment } from '~features/blog/paths';

/**
 * URL concerns of the archive routes only: parsing the `[year]` / `[month]`
 * segments and listing the params to prerender. Which periods exist and what
 * they contain is the application's call (`GetBlogArchiveYear` /
 * `GetBlogArchiveMonth`).
 */

/** `'2026'` → `2026`; anything that isn't a 4-digit year → `undefined`. */
export function parseYearSegment(segment: string): number | undefined {
  return /^\d{4}$/.test(segment) ? Number(segment) : undefined;
}

/** `'09'` → `9`; only the zero-padded `01`–`12` the routes emit, else `undefined`. */
export function parseMonthSegment(segment: string): number | undefined {
  return /^(0[1-9]|1[0-2])$/.test(segment) ? Number(segment) : undefined;
}

async function listArchive(): Promise<BlogArchiveYearDTO[]> {
  const result = await new ListBlogArchive(
    getServerContainer().blogPostRepository,
  ).execute({ locale: DEFAULT_LOCALE });

  if (result.isLeft()) {
    // eslint-disable-next-line no-console
    console.error(
      '[blog] could not list the archive for static params — no archive pages will be prerendered',
      'Error:',
      result.value,
    );
    return [];
  }

  return result.value;
}

/** Every `(locale, year)` that has published posts. */
export async function archiveYearParams(): Promise<
  { locale: string; year: string }[]
> {
  const archive = await listArchive();

  return LOCALES.flatMap((locale) =>
    archive.map(({ year }) => ({ locale, year: String(year) })),
  );
}

/** Every `(locale, year, month)` that has published posts. */
export async function archiveMonthParams(): Promise<
  { locale: string; year: string; month: string }[]
> {
  const archive = await listArchive();

  return LOCALES.flatMap((locale) =>
    archive.flatMap(({ year, months }) =>
      months.map(({ month }) => ({
        locale,
        year: String(year),
        month: monthSegment(month),
      })),
    ),
  );
}
