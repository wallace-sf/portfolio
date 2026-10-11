import { BlogPostStatus } from '@repo/core/blog';
import { NotFoundError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { IBlogPostRepository } from '~/blog/ports';
import { GetBlogArchiveMonth } from '~/blog/use-cases/GetBlogArchiveMonth';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function post(
  slug: string,
  publishedAt: string,
  status = BlogPostStatus.PUBLISHED,
) {
  return BlogPostBuilder.build()
    .withSlug(slug)
    .withStatus(status)
    .withPublishedAt(publishedAt)
    .now();
}

const POSTS = [
  post('october-post', '2026-10-01T10:00:00.000Z'),
  post('september-early', '2026-09-02T10:00:00.000Z'),
  post('september-late', '2026-09-28T10:00:00.000Z'),
  post('july-draft', '2026-07-10T10:00:00.000Z', BlogPostStatus.DRAFT),
  post('last-year', '2025-12-24T10:00:00.000Z'),
  post('old-draft', '2024-03-01T10:00:00.000Z', BlogPostStatus.DRAFT),
];

function makeRepository(
  overrides: Partial<IBlogPostRepository> = {},
): IBlogPostRepository {
  return {
    findAll: vi.fn().mockResolvedValue(POSTS),
    findBySlug: vi.fn(),
    ...overrides,
  };
}

const failingRepository = () =>
  makeRepository({ findAll: vi.fn().mockRejectedValue(new Error('db down')) });

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GetBlogArchiveMonth', () => {
  it("should return the month's published posts, newest first, when the month has posts", async () => {
    const result = await new GetBlogArchiveMonth(makeRepository()).execute({
      locale: 'pt-BR',
      year: 2026,
      month: 9,
    });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value.month).toBe(9);
    expect(result.value.count).toBe(2);
    expect(result.value.posts.map((p) => p.slug)).toEqual([
      'september-late',
      'september-early',
    ]);
  });

  it('should return Left(NotFoundError) when the month only has unpublished posts', async () => {
    const result = await new GetBlogArchiveMonth(makeRepository()).execute({
      locale: 'en-US',
      year: 2026,
      month: 7,
    });

    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return Left(NotFoundError) when the month exists in another year only', async () => {
    const result = await new GetBlogArchiveMonth(makeRepository()).execute({
      locale: 'en-US',
      year: 2025,
      month: 9,
    });

    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return Left(DomainError) with FETCH_FAILED when the repository throws', async () => {
    const result = await new GetBlogArchiveMonth(failingRepository()).execute({
      locale: 'en-US',
      year: 2026,
      month: 9,
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value.code).toBe('FETCH_FAILED');
  });
});
