import { BlogPostStatus } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it } from 'vitest';

import { publishedOnly } from '~/blog/use-cases/published-only';

describe('publishedOnly', () => {
  it('should keep PUBLISHED posts and drop DRAFT and ARCHIVED', () => {
    const posts = [
      BlogPostBuilder.build()
        .withSlug('draft')
        .withStatus(BlogPostStatus.DRAFT)
        .now(),
      BlogPostBuilder.published('published').now(),
      BlogPostBuilder.build()
        .withSlug('archived')
        .withStatus(BlogPostStatus.ARCHIVED)
        .now(),
    ];

    const result = publishedOnly(posts);

    expect(result.map((p) => p.slug.value)).toEqual(['published']);
  });

  it('should not mutate the input array', () => {
    const input = [
      BlogPostBuilder.published('published').now(),
      BlogPostBuilder.build()
        .withSlug('draft')
        .withStatus(BlogPostStatus.DRAFT)
        .now(),
    ];
    const snapshot = [...input];

    publishedOnly(input);

    expect(input).toEqual(snapshot);
  });

  it('should return an empty array unchanged', () => {
    expect(publishedOnly([])).toEqual([]);
  });
});
