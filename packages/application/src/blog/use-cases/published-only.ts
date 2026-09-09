import { BlogPost, BlogPostStatus } from '@repo/core/blog';

/**
 * Keeps only posts a reader is allowed to see: status PUBLISHED. DRAFT and
 * ARCHIVED posts are editorial-only. Returns a new array. The domain owns
 * "published" (BlogPostStatus); this only applies it as the public-audience
 * filter, the same way newestFirst fixes the presentation direction.
 */
export function publishedOnly(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.status === BlogPostStatus.PUBLISHED);
}
