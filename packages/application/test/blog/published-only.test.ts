import { describe, expect, it } from 'vitest';

import { BlogPost, BlogPostStatus, IBlogPostProps } from '@repo/core/blog';

import { publishedOnly } from '~/blog/use-cases/published-only';

const BASE: IBlogPostProps = {
  slug: 'a-post',
  title: { 'en-US': 'T', 'pt-BR': 'T', es: 'T' },
  description: { 'en-US': 'D', 'pt-BR': 'D', es: 'D' },
  content: { 'en-US': 'C', 'pt-BR': 'C', es: 'C' },
  tags: ['nextjs'],
  publishedAt: '2026-08-01T00:00:00.000Z',
};

function makePost(slug: string, status: BlogPostStatus): BlogPost {
  const result = BlogPost.create({ ...BASE, slug, status });
  if (result.isLeft()) throw result.value;
  return result.value;
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
