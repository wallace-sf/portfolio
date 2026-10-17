import { DomainError, Either, Locale, left, right } from '@repo/core/shared';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';
import { IBlogPostRepository } from '../ports';
import { newestFirst } from './newest-first';
import { publishedOnly } from './published-only';
import { toBlogPostSummaryDTO } from './to-summary-dto';

/** Sized for the listing's two-card featured band. */
export const DEFAULT_FEATURED_LIMIT = 2;

export type ListFeaturedBlogPostsInput = {
  locale: Locale;
  limit?: number;
};

/** The published posts an editor marked as featured, newest first. */
export class ListFeaturedBlogPosts extends UseCase<
  ListFeaturedBlogPostsInput,
  BlogPostSummaryDTO[]
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute({
    locale,
    limit = DEFAULT_FEATURED_LIMIT,
  }: ListFeaturedBlogPostsInput): Promise<
    Either<DomainError, BlogPostSummaryDTO[]>
  > {
    try {
      const posts = newestFirst(publishedOnly(await this.repository.findAll()))
        .filter((post) => post.featured)
        .slice(0, limit);

      return right(posts.map((post) => toBlogPostSummaryDTO(post, locale)));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        '[ListFeaturedBlogPosts] Failed to fetch blog posts:',
        error,
      );
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch featured blog posts',
        }),
      );
    }
  }
}
