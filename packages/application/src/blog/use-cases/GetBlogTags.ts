import { DomainError, Either, Locale, left, right } from '@repo/core/shared';
import { groupBy } from '@repo/utils/collections';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogTagDTO } from '../dtos/BlogTagDTO';
import { IBlogPostRepository } from '../ports';
import { publishedOnly } from './published-only';

export type GetBlogTagsInput = {
  /** Accepted for symmetry with the other blog use cases; tags aren't localized. */
  locale: Locale;
};

/** Most used first; ties by name, so the order is stable across builds. */
const byCountThenTag = (a: BlogTagDTO, b: BlogTagDTO): number =>
  b.count - a.count || a.tag.localeCompare(b.tag);

/**
 * Every tag used by a published post, with how many published posts use it.
 * This order is also what the listing calls "trending".
 */
export class GetBlogTags extends UseCase<GetBlogTagsInput, BlogTagDTO[]> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    _input: GetBlogTagsInput,
  ): Promise<Either<DomainError, BlogTagDTO[]>> {
    try {
      const tags = publishedOnly(await this.repository.findAll()).flatMap(
        (post) => post.tags.map(({ value }) => value),
      );

      return right(
        groupBy(tags, (tag) => tag)
          .map(([tag, uses]) => ({ tag, count: uses.length }))
          .sort(byCountThenTag),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[GetBlogTags] Failed to fetch blog posts:', error);
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog tags',
        }),
      );
    }
  }
}
