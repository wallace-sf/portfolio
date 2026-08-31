import { BlogPost } from '@repo/core/blog';
import { DomainError, Either, Locale, left, right } from '@repo/core/shared';

import { ApplicationErrorCode } from '../../shared/ApplicationErrorCode';
import { UseCase } from '../../shared/UseCase';
import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';
import { IBlogPostRepository } from '../ports';
import { orderByPublication } from './order-by-publication';

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
      const posts = orderByPublication(await this.repository.findAll());
      return right(posts.map((post) => this.toDTO(post, input.locale)));
    } catch {
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog posts',
        }),
      );
    }
  }

  private toDTO(post: BlogPost, locale: Locale): BlogPostSummaryDTO {
    return {
      slug: post.slug.value,
      title: post.title.get(locale),
      description: post.description.get(locale),
      publishedAt: post.publishedAt.value,
      tags: post.tags.map((tag) => tag.value),
      coverImage: post.coverImage
        ? {
            url: post.coverImage.url.value,
            alt: post.coverImage.alt.get(locale),
          }
        : undefined,
      thumbnailImage: post.thumbnailImage
        ? {
            url: post.thumbnailImage.url.value,
            alt: post.thumbnailImage.alt.get(locale),
          }
        : undefined,
    };
  }
}
