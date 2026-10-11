import { BlogPost } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it } from 'vitest';

import { newestFirst } from '~/blog/use-cases/newest-first';

function makePost(slug: string, publishedAt: string): BlogPost {
  return BlogPostBuilder.build()
    .withSlug(slug)
    .withPublishedAt(publishedAt)
    .now();
}

describe('newestFirst', () => {
  it('should order posts from most to least recently published', () => {
    const older = makePost('older', '2026-01-01T00:00:00.000Z');
    const newest = makePost('newest', '2026-12-01T00:00:00.000Z');
    const middle = makePost('middle', '2026-06-01T00:00:00.000Z');

    const ordered = newestFirst([older, newest, middle]);

    expect(ordered.map((p) => p.slug.value)).toEqual([
      'newest',
      'middle',
      'older',
    ]);
  });

  it('should not mutate the input array', () => {
    const input = [
      makePost('post-a', '2026-01-01T00:00:00.000Z'),
      makePost('post-b', '2026-02-01T00:00:00.000Z'),
    ];
    const snapshot = [...input];

    newestFirst(input);

    expect(input).toEqual(snapshot);
  });

  it('should return an empty array unchanged', () => {
    expect(newestFirst([])).toEqual([]);
  });
});
