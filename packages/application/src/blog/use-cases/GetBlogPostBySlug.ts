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
import { BlogPostDetailDTO } from '../dtos/BlogPostDetailDTO';
import { IBlogPostRepository } from '../ports';

export type GetBlogPostBySlugInput = {
  slug: string;
  locale: Locale;
};

export class GetBlogPostBySlug extends UseCase<
  GetBlogPostBySlugInput,
  BlogPostDetailDTO,
  NotFoundError | ValidationError | DomainError
> {
  constructor(private readonly repository: IBlogPostRepository) {
    super();
  }

  async execute(
    input: GetBlogPostBySlugInput,
  ): Promise<
    Either<NotFoundError | ValidationError | DomainError, BlogPostDetailDTO>
  > {
    const slugResult = Slug.create(input.slug);
    if (slugResult.isLeft()) return left(slugResult.value);

    let post: BlogPost | null;
    try {
      post = await this.repository.findBySlug(slugResult.value);
    } catch {
      return left(
        new DomainError(ApplicationErrorCode.FETCH_FAILED, {
          message: 'Failed to fetch blog post',
        }),
      );
    }

    if (!post) {
      return left(new NotFoundError({ slug: input.slug }));
    }

    return right(this.toDTO(post, input.locale));
  }

  private toDTO(post: BlogPost, locale: Locale): BlogPostDetailDTO {
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
      content: post.content.get(locale),
    };
  }
}
