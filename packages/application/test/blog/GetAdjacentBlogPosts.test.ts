import { describe, expect, it, vi } from 'vitest';

import { BlogPost, IBlogPostProps } from '@repo/core/blog';
import { NotFoundError } from '@repo/core/shared';

import { IBlogPostRepository } from '~/blog/ports';
import { GetAdjacentBlogPosts } from '~/blog/use-cases/GetAdjacentBlogPosts';

const BASE: IBlogPostProps = {
  slug: 'a-post',
  title: {
    'en-US': 'A Post',
    'pt-BR': 'Um Post',
    es: 'Una Publicación',
  },
  description: { 'en-US': 'D', 'pt-BR': 'D', es: 'D' },
  content: { 'en-US': 'C', 'pt-BR': 'C', es: 'C' },
  tags: ['nextjs'],
  publishedAt: '2026-08-01T00:00:00.000Z',
};

function makePost(slug: string, publishedAt: string): BlogPost {
  const result = BlogPost.create({
    ...BASE,
    slug,
    publishedAt,
    title: {
      'en-US': `Title ${slug}`,
      'pt-BR': `Título ${slug}`,
      es: `Título ${slug}`,
    },
  });
  if (result.isLeft()) throw result.value;
  return result.value;
}

function makeRepository(
  overrides: Partial<IBlogPostRepository> = {},
): IBlogPostRepository {
  return { findAll: vi.fn(), findBySlug: vi.fn(), ...overrides };
}

// Returned deliberately out of order — the use case owns the ordering.
const POSTS = [
  makePost('middle', '2026-08-15T00:00:00.000Z'),
  makePost('oldest', '2026-08-08T00:00:00.000Z'),
  makePost('newest', '2026-08-22T00:00:00.000Z'),
];

describe('GetAdjacentBlogPosts', () => {
  it('should return the newer and older neighbours for a post in the middle', async () => {
    const repo = makeRepository({
      findAll: vi.fn().mockResolvedValue(POSTS),
    });

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'middle',
      locale: 'pt-BR',
    });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value).toEqual({
      newer: { slug: 'newest', title: 'Título newest' },
      older: { slug: 'oldest', title: 'Título oldest' },
    });
  });

  it('should return only an older neighbour for the newest post', async () => {
    const repo = makeRepository({
      findAll: vi.fn().mockResolvedValue(POSTS),
    });

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'newest',
      locale: 'en-US',
    });

    expect(result.isRight() && result.value).toEqual({
      newer: undefined,
      older: { slug: 'middle', title: 'Title middle' },
    });
  });

  it('should return only a newer neighbour for the oldest post', async () => {
    const repo = makeRepository({
      findAll: vi.fn().mockResolvedValue(POSTS),
    });

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'oldest',
      locale: 'en-US',
    });

    expect(result.isRight() && result.value).toEqual({
      newer: { slug: 'middle', title: 'Title middle' },
      older: undefined,
    });
  });

  it('should return no neighbours when the post is the only one', async () => {
    const repo = makeRepository({
      findAll: vi.fn().mockResolvedValue([makePost('lonely', '2026-08-01')]),
    });

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'lonely',
      locale: 'en-US',
    });

    expect(result.isRight() && result.value).toEqual({
      newer: undefined,
      older: undefined,
    });
  });

  it('should return NotFoundError when the slug is not among the posts', async () => {
    const repo = makeRepository({
      findAll: vi.fn().mockResolvedValue(POSTS),
    });

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'ghost-post',
      locale: 'en-US',
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return Left(ValidationError) for a malformed slug', async () => {
    const repo = makeRepository();

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
    const repo = makeRepository({
      findAll: vi.fn().mockRejectedValue(new Error('fs down')),
    });

    const result = await new GetAdjacentBlogPosts(repo).execute({
      slug: 'middle',
      locale: 'en-US',
    });

    expect(result.isLeft() && result.value.code).toBe('FETCH_FAILED');
  });
});
