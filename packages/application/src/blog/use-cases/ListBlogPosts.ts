import { DomainError, Either, Locale, left, right } from '@repo/core/shared';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';
import { IBlogPostRepository } from '../ports';
import { newestFirst } from './newest-first';
import { publishedOnly } from './published-only';
import { toBlogPostSummaryDTO } from './to-summary-dto';

export type ListBlogPostsInput = {
  locale: Locale;
};

export class ListBlogPosts extends UseCase<
  ListBlogPostsInput,
  BlogPostSummaryDTO[]
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: ListBlogPostsInput,
  ): Promise<Either<DomainError, BlogPostSummaryDTO[]>> {
    try {
      const posts = newestFirst(publishedOnly(await this.repository.findAll()));
      return right(
        posts.map((post) => toBlogPostSummaryDTO(post, input.locale)),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ListBlogPosts] Failed to fetch blog posts:', error);
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog posts',
        }),
      );
    }
  }
}
