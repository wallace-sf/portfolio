import { BlogPost } from '@repo/core/blog';

/**
 * Posts ordered most-recently-published first — the order the blog presents to
 * readers (the listing) and walks for prev/next navigation. The comparison rule
 * is the domain's (`BlogPost.compareByPublication`); this only fixes the
 * direction and returns a copy so callers never mutate the repository result.
 */
export function newestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => BlogPost.compareByPublication(b, a));
}
