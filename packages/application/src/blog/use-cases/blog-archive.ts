import { DomainError, Either, Locale, left, right } from '@repo/core/shared';
import { groupBy } from '@repo/utils/collections';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { BlogArchiveYearDTO } from '../dtos/BlogArchiveDTO';
import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';
import { IBlogPostRepository } from '../ports';
import { newestFirst } from './newest-first';
import { publishedOnly } from './published-only';
import { toBlogPostSummaryDTO } from './to-summary-dto';

const yearOf = (post: BlogPostSummaryDTO) =>
  new Date(post.publishedAt).getUTCFullYear();

const monthOf = (post: BlogPostSummaryDTO) =>
  new Date(post.publishedAt).getUTCMonth() + 1;

const groupByPeriod = (posts: BlogPostSummaryDTO[]): BlogArchiveYearDTO[] =>
  groupBy(posts, yearOf).map(([year, yearPosts]) => ({
    year,
    count: yearPosts.length,
    months: groupBy(yearPosts, monthOf).map(([month, monthPosts]) => ({
      month,
      count: monthPosts.length,
      posts: monthPosts,
    })),
  }));

/**
 * The whole public archive: published posts grouped year → month (both from
 * `publishedAt` in UTC), newest first at every level. Shared by the archive
 * use cases so the listing and the per-period lookups group identically.
 * Module-local, like `newest-first.ts`.
 */
export async function loadBlogArchive(
  repository: IBlogPostRepository,
  locale: Locale,
): Promise<Either<DomainError, BlogArchiveYearDTO[]>> {
  try {
    const posts = newestFirst(publishedOnly(await repository.findAll()));
    return right(
      groupByPeriod(posts.map((post) => toBlogPostSummaryDTO(post, locale))),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[blog archive] Failed to fetch blog posts:', error);
    return left(
      new DomainError(ApplicationErrorCode.FETCH_FAILED, {
        message: 'Failed to fetch blog archive',
      }),
    );
  }
}
