import {
  type BlogArchiveMonthDTO,
  type BlogArchiveYearDTO,
  ListBlogArchive,
} from '@repo/application/blog';
import { DEFAULT_LOCALE, type Locale, LOCALES } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';
import { monthSegment } from '~features/blog/paths';

/** Published posts grouped year → month; `[]` (logged) when the use case fails. */
export async function loadBlogArchive(
  locale: Locale,
): Promise<BlogArchiveYearDTO[]> {
  const result = await new ListBlogArchive(
    getServerContainer().blogPostRepository,
  ).execute({ locale });

  if (result.isLeft()) {
    // eslint-disable-next-line no-console
    console.error('[blog] could not load the archive:', result.value);
    return [];
  }

  return result.value;
}

/** The archive year matching the `[year]` URL segment, if it has posts. */
export function findArchiveYear(
  archive: BlogArchiveYearDTO[],
  year: string,
): BlogArchiveYearDTO | undefined {
  return archive.find((group) => String(group.year) === year);
}

/** The archive month matching the `[year]/[month]` URL segments, if it has posts. */
export function findArchiveMonth(
  archive: BlogArchiveYearDTO[],
  year: string,
  month: string,
): BlogArchiveMonthDTO | undefined {
  return findArchiveYear(archive, year)?.months.find(
    (group) => monthSegment(group.month) === month,
  );
}

/** Every `(locale, year)` that has published posts. */
export async function archiveYearParams(): Promise<
  { locale: string; year: string }[]
> {
  const archive = await loadBlogArchive(DEFAULT_LOCALE);

  return LOCALES.flatMap((locale) =>
    archive.map(({ year }) => ({ locale, year: String(year) })),
  );
}

/** Every `(locale, year, month)` that has published posts. */
export async function archiveMonthParams(): Promise<
  { locale: string; year: string; month: string }[]
> {
  const archive = await loadBlogArchive(DEFAULT_LOCALE);

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
