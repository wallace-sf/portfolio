import { BlogPost } from '@repo/core/blog';

const sharedTagCount = (a: BlogPost, b: BlogPost): number =>
  a.tags.filter((tag) => b.tags.some((other) => other.equals(tag))).length;

/**
 * The posts most related to `target`: those sharing at least one tag with it,
 * ranked by how many tags they share (most first), ties broken newest first,
 * capped at `limit`. `target` itself never ranks. Returns a new array.
 */
export function rankRelated(
  target: BlogPost,
  candidates: BlogPost[],
  limit: number,
): BlogPost[] {
  return candidates
    .filter((post) => !post.slug.equals(target.slug))
    .map((post) => ({ post, shared: sharedTagCount(post, target) }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared || BlogPost.compareByPublication(b.post, a.post),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}
