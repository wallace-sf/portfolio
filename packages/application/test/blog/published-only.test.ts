import { BlogPost, BlogPostStatus } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it } from 'vitest';

import { publishedOnly } from '~/blog/use-cases/published-only';

function makePost(slug: string, status: BlogPostStatus): BlogPost {
  return BlogPostBuilder.build().withSlug(slug).withStatus(status).now();
}

describe('publishedOnly', () => {
  it('should keep PUBLISHED posts and drop DRAFT and ARCHIVED', () => {
    const posts = [
      makePost('draft', BlogPostStatus.DRAFT),
      makePost('published', BlogPostStatus.PUBLISHED),
      makePost('archived', BlogPostStatus.ARCHIVED),
    ];

    const result = publishedOnly(posts);

    expect(result.map((p) => p.slug.value)).toEqual(['published']);
  });

  it('should not mutate the input array', () => {
    const input = [
      makePost('published', BlogPostStatus.PUBLISHED),
      makePost('draft', BlogPostStatus.DRAFT),
    ];
    const snapshot = [...input];

    publishedOnly(input);

    expect(input).toEqual(snapshot);
  });

  it('should return an empty array unchanged', () => {
    expect(publishedOnly([])).toEqual([]);
  });
});
