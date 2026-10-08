import { BlogPost } from '@repo/core/blog';
import { Locale } from '@repo/core/shared';

import { BlogPostSummaryDTO } from '../dtos/BlogPostSummaryDTO';

/**
 * The listing-card view of a post, resolved to one locale. Shared by every use
 * case that returns summaries (the listing, the archive) so they never drift.
 */
export function toBlogPostSummaryDTO(
  post: BlogPost,
  locale: Locale,
): BlogPostSummaryDTO {
  return {
    slug: post.slug.value,
    title: post.title.get(locale),
    description: post.description.get(locale),
    publishedAt: post.publishedAt.value,
    featured: post.featured,
    tags: post.tags.map((tag) => tag.value),
    author: {
      name: post.author.name.value,
      avatarUrl: post.author.avatarUrl.value,
      url: post.author.url?.value,
    },
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
