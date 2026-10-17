import { Tag } from '@repo/core/blog';
import {
  DomainError,
  Either,
  Locale,
  ValidationError,
  left,
  right,
} from '@repo/core/shared';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';
import { IBlogPostRepository } from '../ports';
import { newestFirst } from './newest-first';
import { publishedOnly } from './published-only';
import { toBlogPostSummaryDTO } from './to-summary-dto';

export type ListBlogPostsByTagInput = {
  tag: string;
  locale: Locale;
};

/**
 * The published posts carrying a tag, newest first. A valid tag no post uses
 * is an empty list, not an error; the page decides that this means 404.
 */
export class ListBlogPostsByTag extends UseCase<
  ListBlogPostsByTagInput,
  BlogPostSummaryDTO[],
  ValidationError | DomainError
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: ListBlogPostsByTagInput,
  ): Promise<Either<ValidationError | DomainError, BlogPostSummaryDTO[]>> {
    const tagResult = Tag.create(input.tag);
    if (tagResult.isLeft()) return left(tagResult.value);
    const tag = tagResult.value;

    try {
      const posts = newestFirst(
        publishedOnly(await this.repository.findAll()),
      ).filter((post) => post.tags.some((postTag) => postTag.equals(tag)));

      return right(
        posts.map((post) => toBlogPostSummaryDTO(post, input.locale)),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ListBlogPostsByTag] Failed to fetch blog posts:', error);
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog posts by tag',
        }),
      );
    }
  }
}
