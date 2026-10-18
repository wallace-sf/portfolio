import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it } from 'vitest';

import { newestFirst } from '~/blog/use-cases/newest-first';

describe('newestFirst', () => {
  it('should order posts from most to least recently published', () => {
    const older = BlogPostBuilder.published(
      'older',
      '2026-01-01T00:00:00.000Z',
    ).now();
    const newest = BlogPostBuilder.published(
      'newest',
      '2026-12-01T00:00:00.000Z',
    ).now();
    const middle = BlogPostBuilder.published(
      'middle',
      '2026-06-01T00:00:00.000Z',
    ).now();

    const ordered = newestFirst([older, newest, middle]);

    expect(ordered.map((p) => p.slug.value)).toEqual([
      'newest',
      'middle',
      'older',
    ]);
  });

  it('should not mutate the input array', () => {
    const input = [
      BlogPostBuilder.published('post-a', '2026-01-01T00:00:00.000Z').now(),
      BlogPostBuilder.published('post-b', '2026-02-01T00:00:00.000Z').now(),
    ];
    const snapshot = [...input];

    newestFirst(input);

    expect(input).toEqual(snapshot);
  });

  it('should return an empty array unchanged', () => {
    expect(newestFirst([])).toEqual([]);
  });
});
