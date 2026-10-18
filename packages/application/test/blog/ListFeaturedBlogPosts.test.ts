import { BlogPost } from '@repo/core/blog';
import { DomainError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_FEATURED_LIMIT,
  ListFeaturedBlogPosts,
} from '~/blog/use-cases/ListFeaturedBlogPosts';
import { ApplicationErrorCode } from '~/shared/ApplicationErrorCode';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

const useCaseOver = (posts: BlogPost[]) =>
  new ListFeaturedBlogPosts(
    makeBlogPostRepository({ findAll: vi.fn().mockResolvedValue(posts) }),
  );

const slugs = async (result: ReturnType<ListFeaturedBlogPosts['execute']>) => {
  const resolved = await result;
  expect(resolved.isRight()).toBe(true);
  return resolved.isRight() ? resolved.value.map(({ slug }) => slug) : [];
};

describe('ListFeaturedBlogPosts', () => {
  it('should list only featured published posts, newest first, when posts are mixed', async () => {
    const useCase = useCaseOver([
      BlogPostBuilder.published('older-featured', '2026-08-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
      BlogPostBuilder.published('not-featured', '2026-10-01T00:00:00.000Z')
        .withFeatured(false)
        .now(),
      BlogPostBuilder.published('newer-featured', '2026-09-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
      BlogPostBuilder.draft('draft-featured', '2026-10-05T00:00:00.000Z')
        .withFeatured(true)
        .now(),
    ]);

    expect(await slugs(useCase.execute({ locale: 'en-US' }))).toEqual([
      'newer-featured',
      'older-featured',
    ]);
  });

  it('should cap the list at the default limit when more posts are featured', async () => {
    const useCase = useCaseOver([
      BlogPostBuilder.published('first', '2026-08-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
      BlogPostBuilder.published('second', '2026-09-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
      BlogPostBuilder.published('third', '2026-10-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
    ]);

    const result = await slugs(useCase.execute({ locale: 'en-US' }));

    expect(DEFAULT_FEATURED_LIMIT).toBe(2);
    expect(result).toEqual(['third', 'second']);
  });

  it('should honour a custom limit when one is given', async () => {
    const useCase = useCaseOver([
      BlogPostBuilder.published('first', '2026-08-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
      BlogPostBuilder.published('second', '2026-09-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
      BlogPostBuilder.published('third', '2026-10-01T00:00:00.000Z')
        .withFeatured(true)
        .now(),
    ]);

    expect(await slugs(useCase.execute({ locale: 'pt-BR', limit: 3 }))).toEqual(
      ['third', 'second', 'first'],
    );
  });

  it('should return an empty list when no published post is featured', async () => {
    const useCase = useCaseOver([
      BlogPostBuilder.published('plain', '2026-08-01T00:00:00.000Z')
        .withFeatured(false)
        .now(),
    ]);

    expect(await slugs(useCase.execute({ locale: 'en-US' }))).toEqual([]);
  });

  it('should return FETCH_FAILED when the repository throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const repo = makeBlogPostRepository({
      findAll: vi.fn().mockRejectedValue(new Error('db down')),
    });

    const result = await new ListFeaturedBlogPosts(repo).execute({
      locale: 'en-US',
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(DomainError);
    expect(result.value.code).toBe(ApplicationErrorCode.FETCH_FAILED);
  });
});
