import { BlogPost } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it } from 'vitest';

import { rankRelated } from '~/blog/use-cases/rank-related';

function makePost(
  slug: string,
  tags: string[],
  publishedAt = '2026-10-01T00:00:00.000Z',
): BlogPost {
  return BlogPostBuilder.build()
    .withSlug(slug)
    .withTags(tags)
    .withPublishedAt(publishedAt)
    .now();
}

const slugsOf = (posts: BlogPost[]) => posts.map((post) => post.slug.value);

const target = makePost('target', ['architecture', 'ddd', 'monorepo']);

describe('rankRelated', () => {
  it('should rank posts sharing more tags first when overlaps differ', () => {
    const one = makePost('one-shared', ['ddd']);
    const three = makePost('three-shared', ['architecture', 'ddd', 'monorepo']);
    const two = makePost('two-shared', ['architecture', 'monorepo']);

    expect(slugsOf(rankRelated(target, [one, three, two], 3))).toEqual([
      'three-shared',
      'two-shared',
      'one-shared',
    ]);
  });

  it('should break ties newest first when posts share the same number of tags', () => {
    const older = makePost('older', ['ddd'], '2026-08-01T00:00:00.000Z');
    const newer = makePost('newer', ['monorepo'], '2026-09-01T00:00:00.000Z');

    expect(slugsOf(rankRelated(target, [older, newer], 3))).toEqual([
      'newer',
      'older',
    ]);
  });

  it('should exclude the target itself when it is among the candidates', () => {
    const other = makePost('other', ['ddd']);

    expect(slugsOf(rankRelated(target, [target, other], 3))).toEqual(['other']);
  });

  it('should drop posts with no shared tag', () => {
    const unrelated = makePost('unrelated', ['testing', 'seo']);

    expect(rankRelated(target, [unrelated], 3)).toEqual([]);
  });

  it('should cap the result at the limit when more posts are related', () => {
    const candidates = ['post-a', 'post-b', 'post-c', 'post-d'].map((slug) =>
      makePost(slug, ['ddd']),
    );

    expect(rankRelated(target, candidates, 3)).toHaveLength(3);
  });

  it('should not mutate the candidates array', () => {
    const candidates = [
      makePost('post-a', ['ddd'], '2026-01-01T00:00:00.000Z'),
      makePost('post-b', ['ddd', 'monorepo'], '2026-02-01T00:00:00.000Z'),
    ];
    const snapshot = [...candidates];

    rankRelated(target, candidates, 3);

    expect(candidates).toEqual(snapshot);
  });
});
