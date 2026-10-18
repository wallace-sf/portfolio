import { DomainError, Either, Locale, left, right } from '@repo/core/shared';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogSearchEntryDTO } from '../dtos/BlogSearchEntryDTO';
import { IBlogPostRepository } from '../ports';
import { newestFirst } from './newest-first';
import { toPlainText } from './plain-text';
import { publishedOnly } from './published-only';

export type GetBlogSearchIndexInput = {
  locale: Locale;
};

/** The plain-text body of every published post, for client-side search. */
export class GetBlogSearchIndex extends UseCase<
  GetBlogSearchIndexInput,
  BlogSearchEntryDTO[]
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: GetBlogSearchIndexInput,
  ): Promise<Either<DomainError, BlogSearchEntryDTO[]>> {
    try {
      const posts = newestFirst(publishedOnly(await this.repository.findAll()));
      return right(
        posts.map((post) => ({
          slug: post.slug.value,
          text: toPlainText(post.content.get(input.locale)),
        })),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[GetBlogSearchIndex] Failed to fetch blog posts:', error);
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog posts',
        }),
      );
    }
  }
}
