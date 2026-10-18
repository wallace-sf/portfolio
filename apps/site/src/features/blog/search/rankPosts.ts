import { foldForSearch } from '@repo/utils/text';

import type { SearchablePost, SearchBodies } from './types';

/** The folded fields of a post, most telling first: the index is the rank. */
const fieldsOf = (post: SearchablePost, bodies: SearchBodies): string[] =>
  [
    post.title,
    post.tags.join(' '),
    post.description,
    bodies[post.slug] ?? '',
  ].map((field) => foldForSearch(field.normalize('NFC')));

/** The best field `term` appears in, or `-1` when it appears in none. */
const bestField = (fields: string[], term: string): number =>
  fields.findIndex((field) => field.includes(term));

/**
 * The posts where every term appears in some field, best first: a post
 * ranks by the best field any term hit (title → tags → description → body).
 * Ties keep the input order, which is newest first.
 */
export function rankPosts(
  posts: readonly SearchablePost[],
  bodies: SearchBodies,
  terms: readonly string[],
): SearchablePost[] {
  if (terms.length === 0) return [];

  return posts
    .map((post) => {
      const fields = fieldsOf(post, bodies);
      const hits = terms.map((term) => bestField(fields, term));
      return { post, hits };
    })
    .filter(({ hits }) => hits.every((hit) => hit >= 0))
    .map(({ post, hits }) => ({ post, rank: Math.min(...hits) }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ post }) => post);
}
