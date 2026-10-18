import { BlogPost, BlogPostStatus } from '@repo/core/blog';
import { NotFoundError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { GetAdjacentBlogPosts } from '~/blog/use-cases/GetAdjacentBlogPosts';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

// Titles differ per locale so the tests can tell which one was resolved.
const titleOf = (slug: string) => ({
  'en-US': `Title ${slug}`,
  'pt-BR': `Título ${slug}`,
  es: `Título ${slug}`,
});

// Returned deliberately out of order — the use case owns the ordering.
const POSTS = [
  BlogPostBuilder.published('middle', '2026-08-15T00:00:00.000Z')
    .withTitle(titleOf('middle'))
    .now(),
  BlogPostBuilder.published('oldest', '2026-08-08T00:00:00.000Z')
    .withTitle(titleOf('oldest'))
    .now(),
  BlogPostBuilder.published('newest', '2026-08-22T00:00:00.000Z')
    .withTitle(titleOf('newest'))
    .now(),
];

const repositoryWith = (posts: BlogPost[]) =>
  makeBlogPostRepository({ findAll: vi.fn().mockResolvedValue(posts) });

describe('GetAdjacentBlogPosts', () => {
  it('should return the newer and older neighbours for a post in the middle', async () => {
    const repo = repositoryWith(POSTS);

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'middle',
      locale: 'pt-BR',
    });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value).toEqual({
      newer: {
        slug: 'newest',
        title: 'Título newest',
        publishedAt: '2026-08-22T00:00:00.000Z',
      },
      older: {
        slug: 'oldest',
        title: 'Título oldest',
        publishedAt: '2026-08-08T00:00:00.000Z',
      },
    });
  });

  it('should return only an older neighbour for the newest post', async () => {
    const repo = repositoryWith(POSTS);

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'newest',
      locale: 'en-US',
    });

    expect(result.isRight() && result.value).toEqual({
      newer: undefined,
      older: {
        slug: 'middle',
        title: 'Title middle',
        publishedAt: '2026-08-15T00:00:00.000Z',
      },
    });
  });

  it('should return only a newer neighbour for the oldest post', async () => {
    const repo = repositoryWith(POSTS);

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'oldest',
      locale: 'en-US',
    });

    expect(result.isRight() && result.value).toEqual({
      newer: {
        slug: 'middle',
        title: 'Title middle',
        publishedAt: '2026-08-15T00:00:00.000Z',
      },
      older: undefined,
    });
  });

  it('should return no neighbours when the post is the only one', async () => {
    const repo = repositoryWith([
      BlogPostBuilder.published('lonely', '2026-08-01').now(),
    ]);

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'lonely',
      locale: 'en-US',
    });

    expect(result.isRight() && result.value).toEqual({
      newer: undefined,
      older: undefined,
    });
  });

  it('should skip a DRAFT post sitting between two published posts', async () => {
    const repo = repositoryWith([
      BlogPostBuilder.published(
        'older-published',
        '2026-08-01T00:00:00.000Z',
      ).now(),
      BlogPostBuilder.build()
        .withSlug('hidden-draft')
        .withPublishedAt('2026-08-10T00:00:00.000Z')
        .withStatus(BlogPostStatus.DRAFT)
        .now(),
      BlogPostBuilder.published(
        'newer-published',
        '2026-08-20T00:00:00.000Z',
      ).now(),
    ]);

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'older-published',
      locale: 'en-US',
    });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value.newer?.slug).toBe('newer-published');
    expect(result.value.older).toBeUndefined();
  });

  it('should return NotFoundError when the requested slug is a DRAFT post', async () => {
    const repo = repositoryWith([
      BlogPostBuilder.published('published', '2026-08-01T00:00:00.000Z').now(),
      BlogPostBuilder.build()
        .withSlug('secret')
        .withPublishedAt('2026-08-10T00:00:00.000Z')
        .withStatus(BlogPostStatus.DRAFT)
        .now(),
    ]);

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'secret',
      locale: 'en-US',
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return NotFoundError when the slug is not among the posts', async () => {
    const repo = repositoryWith(POSTS);

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'ghost-post',
      locale: 'en-US',
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return Left(ValidationError) for a malformed slug', async () => {
    const repo = makeBlogPostRepository();

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'Not A Slug!',
      locale: 'en-US',
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value.code).toBe('INVALID_SLUG');
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('should return Left(FETCH_FAILED) when the repository throws', async () => {
    const repo = makeBlogPostRepository({
      findAll: vi.fn().mockRejectedValue(new Error('fs down')),
    });

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'middle',
      locale: 'en-US',
    });

    expect(result.isLeft() && result.value.code).toBe('FETCH_FAILED');
  });
});
