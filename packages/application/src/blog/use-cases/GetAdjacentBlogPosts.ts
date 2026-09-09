import { BlogPost, BlogPostSequence } from '@repo/core/blog';
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
import {
  BlogPostLinkDTO,
  BlogPostNavigationDTO,
} from '../dtos/BlogPostNavigationDTO';
import { IBlogPostRepository } from '../ports';
import { publishedOnly } from './published-only';

export type GetAdjacentBlogPostsInput = {
  slug: string;
  locale: Locale;
};

/**
 * Resolves the posts immediately newer and older than `slug` in publication
 * order. Delegates the adjacency lookup to the `BlogPostSequence` domain
 * service and only maps the result to DTOs — the delivery layer just renders.
 */
export class GetAdjacentBlogPosts extends UseCase<
  GetAdjacentBlogPostsInput,
  BlogPostNavigationDTO,
  NotFoundError | ValidationError | DomainError
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: GetAdjacentBlogPostsInput,
  ): Promise<
    Either<NotFoundError | ValidationError | DomainError, BlogPostNavigationDTO>
  > {
    const slugResult = Slug.create(input.slug);
    if (slugResult.isLeft()) return left(slugResult.value);

    let posts: BlogPost[];
    try {
      posts = await this.repository.findAll();
    } catch {
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog posts',
        }),
      );
    }

    const neighbours = BlogPostSequence.neighboursOf(
      publishedOnly(posts),
      slugResult.value,
    );

    if (!neighbours) return left(new NotFoundError({ slug: input.slug }));

    return right({
      newer: neighbours.newer
        ? this.toLink(neighbours.newer, input.locale)
        : undefined,
      older: neighbours.older
        ? this.toLink(neighbours.older, input.locale)
        : undefined,
    });
  }

  private toLink(post: BlogPost, locale: Locale): BlogPostLinkDTO {
    return {
      slug: post.slug.value,
      title: post.title.get(locale),
      publishedAt: post.publishedAt.value,
    };
  }
}
