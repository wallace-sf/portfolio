import {
  type BlogArchiveMonthDTO,
  type BlogArchiveYearDTO,
  GetBlogArchiveMonth,
  GetBlogArchiveYear,
  ListBlogArchive,
} from '@repo/application/blog';
import {
  DEFAULT_LOCALE,
  type DomainError,
  type Either,
  type Locale,
  LOCALES,
  NotFoundError,
} from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';
import { monthSegment } from '~features/blog/paths';

/**
 * The bridge between the archive routes and the application: parses the
 * `[year]` / `[month]` URL segments, asks `GetBlogArchiveYear` /
 * `GetBlogArchiveMonth` for the period, and lists the params to prerender.
 * Which periods exist and what they contain is the use cases' call.
 */

/** `'2026'` → `2026`; anything that isn't a 4-digit year → `undefined`. */
export function parseYearSegment(segment: string): number | undefined {
  return /^\d{4}$/.test(segment) ? Number(segment) : undefined;
}

/** `'09'` → `9`; only the zero-padded `01`–`12` the routes emit, else `undefined`. */
export function parseMonthSegment(segment: string): number | undefined {
  return /^(0[1-9]|1[0-2])$/.test(segment) ? Number(segment) : undefined;
}

/**
 * The period, or `undefined` when there is none to show (→ 404). A
 * `NotFoundError` is an expected empty period; any other failure is logged.
 */
function periodOrUndefined<T>(
  result: Either<NotFoundError | DomainError, T>,
  archive: 'year' | 'month',
): T | undefined {
  if (result.isRight()) return result.value;

  if (!(result.value instanceof NotFoundError)) {
    // eslint-disable-next-line no-console
    console.error(
      `[blog] could not load the ${archive} archive:`,
      result.value,
    );
  }
  return undefined;
}

/** The archive year, or `undefined` for a malformed or empty year. */
export async function findArchiveYear(
  locale: string,
  yearSegment: string,
): Promise<BlogArchiveYearDTO | undefined> {
  const year = parseYearSegment(yearSegment);
  if (year === undefined) return undefined;

  const result = await new GetBlogArchiveYear(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale, year });

  return periodOrUndefined(result, 'year');
}

export type ArchiveMonth = BlogArchiveMonthDTO & { year: number };

/** The archive month (with its year), or `undefined` for malformed or empty segments. */
export async function findArchiveMonth(
  locale: string,
  yearSegment: string,
  monthSegmentValue: string,
): Promise<ArchiveMonth | undefined> {
  const year = parseYearSegment(yearSegment);
  const month = parseMonthSegment(monthSegmentValue);
  if (year === undefined || month === undefined) return undefined;

  const result = await new GetBlogArchiveMonth(
    getServerContainer().blogPostRepository,
  ).execute({ locale: locale as Locale, year, month });

  const archiveMonth = periodOrUndefined(result, 'month');
  return archiveMonth && { ...archiveMonth, year };
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
