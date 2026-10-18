import { BlogPostStatus } from '@repo/core/blog';
import { NotFoundError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { IBlogPostRepository } from '~/blog/ports';
import { GetBlogArchiveMonth } from '~/blog/use-cases/GetBlogArchiveMonth';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const POSTS = [
  BlogPostBuilder.published('october-post', '2026-10-01T10:00:00.000Z').now(),
  BlogPostBuilder.published(
    'september-early',
    '2026-09-02T10:00:00.000Z',
  ).now(),
  BlogPostBuilder.published('september-late', '2026-09-28T10:00:00.000Z').now(),
  BlogPostBuilder.build()
    .withSlug('july-draft')
    .withPublishedAt('2026-07-10T10:00:00.000Z')
    .withStatus(BlogPostStatus.DRAFT)
    .now(),
  BlogPostBuilder.published('last-year', '2025-12-24T10:00:00.000Z').now(),
  BlogPostBuilder.build()
    .withSlug('old-draft')
    .withPublishedAt('2024-03-01T10:00:00.000Z')
    .withStatus(BlogPostStatus.DRAFT)
    .now(),
];

const makeRepository = (overrides: Partial<IBlogPostRepository> = {}) =>
  makeBlogPostRepository({
    findAll: vi.fn().mockResolvedValue(POSTS),
    ...overrides,
  });

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
