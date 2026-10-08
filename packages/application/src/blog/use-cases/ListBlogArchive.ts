import { DomainError, Either, Locale, left, right } from '@repo/core/shared';
import { groupBy } from '@repo/utils/collections';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogArchiveYearDTO } from '../dtos/BlogArchiveDTO';
import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';
import { IBlogPostRepository } from '../ports';
import { newestFirst } from './newest-first';
import { publishedOnly } from './published-only';
import { toBlogPostSummaryDTO } from './to-summary-dto';

export type ListBlogArchiveInput = {
  locale: Locale;
};

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
 * Published posts grouped year → month (both from `publishedAt` in UTC), newest
 * first at every level. Feeds the archive pages and their static params.
 */
export class ListBlogArchive extends UseCase<
  ListBlogArchiveInput,
  BlogArchiveYearDTO[]
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: ListBlogArchiveInput,
  ): Promise<Either<DomainError, BlogArchiveYearDTO[]>> {
    try {
      const posts = newestFirst(publishedOnly(await this.repository.findAll()));
      return right(
        groupByPeriod(
          posts.map((post) => toBlogPostSummaryDTO(post, input.locale)),
        ),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ListBlogArchive] Failed to fetch blog posts:', error);
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog archive',
        }),
      );
    }
  }
}
