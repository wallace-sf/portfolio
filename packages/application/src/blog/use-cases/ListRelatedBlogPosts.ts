import { BlogPost } from '@repo/core/blog';
import {
  DomainError,
  Either,
  Locale,
  NotFoundError,
  Slug,
  ValidationError,
  left,
  right,
} from '@repo/core/shared';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';
import { IBlogPostRepository } from '../ports';
import { publishedOnly } from './published-only';
import { rankRelated } from './rank-related';
import { toBlogPostSummaryDTO } from './to-summary-dto';

/** Sized for the post page's "Further reading" section. */
export const DEFAULT_RELATED_LIMIT = 3;

export type ListRelatedBlogPostsInput = {
  slug: string;
  locale: Locale;
  limit?: number;
};

/**
 * The published posts sharing tags with `slug`, most shared tags first, then
 * newest first. No overlap is an empty list — there is deliberately no "latest
 * posts" fallback, since prev/next already covers chronology.
 */
export class ListRelatedBlogPosts extends UseCase<
  ListRelatedBlogPostsInput,
  BlogPostSummaryDTO[],
  NotFoundError | ValidationError | DomainError
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute({
    slug,
    locale,
    limit = DEFAULT_RELATED_LIMIT,
  }: ListRelatedBlogPostsInput): Promise<
    Either<NotFoundError | ValidationError | DomainError, BlogPostSummaryDTO[]>
  > {
    const slugResult = Slug.create(slug);
    if (slugResult.isLeft()) return left(slugResult.value);

    let posts: BlogPost[];
    try {
      posts = publishedOnly(await this.repository.findAll());
    } catch {
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog posts',
        }),
      );
    }

    const target = posts.find((post) => post.slug.equals(slugResult.value));
    if (!target) return left(new NotFoundError({ slug }));

    return right(
      rankRelated(target, posts, limit).map((post) =>
        toBlogPostSummaryDTO(post, locale),
      ),
    );
  }
}
