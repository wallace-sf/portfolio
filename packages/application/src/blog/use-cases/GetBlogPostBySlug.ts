import { BlogPost, BlogPostStatus } from '@repo/core/blog';
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
import { toBlogPostSummaryDTO } from './to-summary-dto';

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

    if (!post || post.status !== BlogPostStatus.PUBLISHED) {
      return left(new NotFoundError({ slug: input.slug }));
    }

    return right(this.toDTO(post, input.locale));
  }

  private toDTO(post: BlogPost, locale: Locale): BlogPostDetailDTO {
    const summary = toBlogPostSummaryDTO(post, locale);

    return {
      ...summary,
      author: { ...summary.author, bio: post.author.bio?.get(locale) },
      content: post.content.get(locale),
      updatedAt: post.updatedAt?.value,
    };
  }
}
