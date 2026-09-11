import { Prisma } from '@prisma/client';
import {
  BlogPost,
  BlogPostStatus,
  IAuthorProps,
  IBlogPostProps,
} from '@repo/core/blog';
import { ILocalizedTextInput } from '@repo/core/shared';

import { InfrastructureError } from '../../errors/InfrastructureError';

type PrismaBlogPost = Prisma.BlogPostGetPayload<Record<string, never>>;

export class BlogPostMapper {
  static toDomain(raw: PrismaBlogPost): BlogPost {
    const asLocalized = (v: unknown) => v as ILocalizedTextInput;

    const props: IBlogPostProps = {
      slug: raw.slug,
      title: asLocalized(raw.title),
      description: asLocalized(raw.description),
      content: asLocalized(raw.content),
      tags: raw.tags,
      author: raw.author as unknown as IAuthorProps,
      publishedAt: raw.publishedAt.toISOString(),
      status: raw.status as BlogPostStatus,
      featured: raw.featured,
      coverImage:
        raw.coverImageUrl && raw.coverImageAlt
          ? {
              url: raw.coverImageUrl,
              alt: asLocalized(raw.coverImageAlt),
            }
          : undefined,
      thumbnailImage:
        raw.thumbnailImageUrl && raw.thumbnailImageAlt
          ? {
              url: raw.thumbnailImageUrl,
              alt: asLocalized(raw.thumbnailImageAlt),
            }
          : undefined,
    };

    const result = BlogPost.create(props);
    if (result.isLeft()) {
      throw new InfrastructureError(
        `Failed to map blog post ${raw.slug} to domain: ${result.value.message}`,
        result.value,
      );
    }

    return result.value;
  }
}
