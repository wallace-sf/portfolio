import { Slug } from '../../shared';
import { BlogPost } from '../entities/BlogPost';

export interface IBlogPostNeighbours {
  /** The post published immediately after the target, if any. */
  newer: BlogPost | undefined;
  /** The post published immediately before the target, if any. */
  older: BlogPost | undefined;
}

/**
 * Domain service for the blog's publication sequence — operations that span
 * `BlogPost` aggregates and so belong to no single one. Stateless: no instance,
 * static methods only.
 */
export class BlogPostSequence {
  private constructor() {}

  /**
   * The posts chronologically adjacent to `target` within `posts`.
   * Direction-independent: `newer` was published just after the target, `older`
   * just before. The caller decides which posts are in scope (e.g. published
   * only) and may pass them in any order. Returns `null` when `target` is not
   * among `posts`.
   */
  static neighboursOf(
    posts: BlogPost[],
    target: Slug,
  ): IBlogPostNeighbours | null {
    const ascending = [...posts].sort(BlogPost.compareByPublication);
    const index = ascending.findIndex((post) => post.slug.equals(target));
    if (index === -1) return null;

    return {
      older: index > 0 ? ascending[index - 1] : undefined,
      newer: index < ascending.length - 1 ? ascending[index + 1] : undefined,
    };
  }
}
