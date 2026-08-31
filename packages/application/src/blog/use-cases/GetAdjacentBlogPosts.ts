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
import {
  BlogPostLinkDTO,
  BlogPostNavigationDTO,
} from '../dtos/BlogPostNavigationDTO';
import { IBlogPostRepository } from '../ports';
import { newestFirst } from './newest-first';

export type GetAdjacentBlogPostsInput = {
  slug: string;
  locale: Locale;
};

/**
 * Resolves the posts immediately newer and older than `slug` in publication
 * order. Composes the domain's publication order (`BlogPost.compareByPublication`,
 * applied newest-first) with the adjacency lookup, so the delivery layer only
 * renders the result.
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

    const ordered = newestFirst(posts);
    const index = ordered.findIndex(
      (post) => post.slug.value === slugResult.value.value,
    );

    if (index === -1) return left(new NotFoundError({ slug: input.slug }));

    const newer = index > 0 ? ordered[index - 1] : undefined;
    const older = index < ordered.length - 1 ? ordered[index + 1] : undefined;

    return right({
      newer: newer ? this.toLink(newer, input.locale) : undefined,
      older: older ? this.toLink(older, input.locale) : undefined,
    });
  }

  private toLink(post: BlogPost, locale: Locale): BlogPostLinkDTO {
    return { slug: post.slug.value, title: post.title.get(locale) };
  }
}
