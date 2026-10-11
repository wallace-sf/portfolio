/**
 * The single source of truth for blog URLs. Paths are locale-agnostic: the
 * next-intl `Link` adds the locale prefix, and absolute URLs (sitemap, RSS,
 * JSON-LD) prepend `${siteUrl}/${locale}`.
 *
 * Year and month come from `publishedAt` in UTC — the same rule
 * `ListBlogArchive` groups by, so a post's URL and its archive page agree.
 */

/** The zero-padded URL segment of a month (1–12): `9` → `'09'`. */
export const monthSegment = (month: number): string =>
  String(month).padStart(2, '0');

/** `{ year: '2026', month: '09' }` — the URL segments of a publication date. */
export function publicationSegments(publishedAt: string): {
  year: string;
  month: string;
} {
  const date = new Date(publishedAt);
  return {
    year: String(date.getUTCFullYear()),
    month: monthSegment(date.getUTCMonth() + 1),
  };
}

/** `/blog/{yyyy}/{MM}/{slug}`. */
export function blogPostPath(publishedAt: string, slug: string): string {
  const { year, month } = publicationSegments(publishedAt);
  return `/blog/${year}/${month}/${slug}`;
}

/** `/blog/{yyyy}` or `/blog/{yyyy}/{MM}`; `month` is 1–12. */
export function blogArchivePath(year: number, month?: number): string {
  return month === undefined
    ? `/blog/${year}`
    : `/blog/${year}/${monthSegment(month)}`;
}
