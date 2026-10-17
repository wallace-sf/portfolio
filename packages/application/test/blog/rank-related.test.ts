import { BlogPost } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it } from 'vitest';

import { rankRelated } from '~/blog/use-cases/rank-related';

const slugsOf = (posts: BlogPost[]) => posts.map((post) => post.slug.value);

const target = BlogPostBuilder.published('target')
  .withTags(['architecture', 'ddd', 'monorepo'])
  .now();

describe('rankRelated', () => {
  it('should rank posts sharing more tags first when overlaps differ', () => {
    const one = BlogPostBuilder.published('one-shared').withTags(['ddd']).now();
    const three = BlogPostBuilder.published('three-shared')
      .withTags(['architecture', 'ddd', 'monorepo'])
      .now();
    const two = BlogPostBuilder.published('two-shared')
      .withTags(['architecture', 'monorepo'])
      .now();

    expect(slugsOf(rankRelated(target, [one, three, two], 3))).toEqual([
      'three-shared',
      'two-shared',
      'one-shared',
    ]);
  });

  it('should break ties newest first when posts share the same number of tags', () => {
    const older = BlogPostBuilder.published('older', '2026-08-01T00:00:00.000Z')
      .withTags(['ddd'])
      .now();
    const newer = BlogPostBuilder.published('newer', '2026-09-01T00:00:00.000Z')
      .withTags(['monorepo'])
      .now();

    expect(slugsOf(rankRelated(target, [older, newer], 3))).toEqual([
      'newer',
      'older',
    ]);
  });

  it('should exclude the target itself when it is among the candidates', () => {
    const other = BlogPostBuilder.published('other').withTags(['ddd']).now();

    expect(slugsOf(rankRelated(target, [target, other], 3))).toEqual(['other']);
  });

  it('should drop posts with no shared tag', () => {
    const unrelated = BlogPostBuilder.published('unrelated')
      .withTags(['testing', 'seo'])
      .now();

    expect(rankRelated(target, [unrelated], 3)).toEqual([]);
  });

  it('should cap the result at the limit when more posts are related', () => {
    const candidates = ['post-a', 'post-b', 'post-c', 'post-d'].map((slug) =>
      BlogPostBuilder.published(slug).withTags(['ddd']).now(),
    );

    expect(rankRelated(target, candidates, 3)).toHaveLength(3);
  });

  it('should not mutate the candidates array', () => {
    const candidates = [
      BlogPostBuilder.published('post-a', '2026-01-01T00:00:00.000Z')
        .withTags(['ddd'])
        .now(),
      BlogPostBuilder.published('post-b', '2026-02-01T00:00:00.000Z')
        .withTags(['ddd', 'monorepo'])
        .now(),
    ];
    const snapshot = [...candidates];

    rankRelated(target, candidates, 3);

    expect(candidates).toEqual(snapshot);
  });
});
