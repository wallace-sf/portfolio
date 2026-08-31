import { BlogPost } from '@repo/core/blog';

/**
 * The blog's canonical order: most recently published first. Owned here so no
 * consumer has to assume a particular order coming out of the repository.
 */
export function orderByPublication(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.ms - a.publishedAt.ms);
}
