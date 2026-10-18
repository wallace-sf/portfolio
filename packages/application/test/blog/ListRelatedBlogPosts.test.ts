import { BlogPost, BlogPostStatus } from '@repo/core/blog';
import { NotFoundError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_RELATED_LIMIT,
  ListRelatedBlogPosts,
} from '~/blog/use-cases/ListRelatedBlogPosts';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

const useCaseOver = (posts: BlogPost[]) =>
  new ListRelatedBlogPosts(
    makeBlogPostRepository({ findAll: vi.fn().mockResolvedValue(posts) }),
  );

const slugs = async (result: ReturnType<ListRelatedBlogPosts['execute']>) => {
  const resolved = await result;
  expect(resolved.isRight()).toBe(true);
  return resolved.isRight() ? resolved.value.map(({ slug }) => slug) : [];
};

const target = BlogPostBuilder.published('target')
  .withTags(['architecture', 'ddd'])
  .now();

describe('ListRelatedBlogPosts', () => {
  it('should rank published posts by shared tags, then newest first', async () => {
    const useCase = useCaseOver([
      target,
      BlogPostBuilder.published('one-older', '2026-08-01T00:00:00.000Z')
        .withTags(['ddd'])
        .now(),
      BlogPostBuilder.published('two-shared')
        .withTags(['architecture', 'ddd'])
        .now(),
      BlogPostBuilder.published('one-newer', '2026-09-01T00:00:00.000Z')
        .withTags(['architecture'])
        .now(),
      BlogPostBuilder.published('unrelated').withTags(['seo']).now(),
    ]);

    expect(
      await slugs(useCase.execute({ slug: 'target', locale: 'en-US' })),
    ).toEqual(['two-shared', 'one-newer', 'one-older']);
  });

  it('should skip unpublished candidates when they share tags', async () => {
    const useCase = useCaseOver([
      target,
      BlogPostBuilder.draft('draft').withTags(['ddd']).now(),
    ]);

    expect(
      await slugs(useCase.execute({ slug: 'target', locale: 'en-US' })),
    ).toEqual([]);
  });

  it('should cap the list at the default limit when more posts are related', async () => {
    const useCase = useCaseOver([
      target,
      ...['post-a', 'post-b', 'post-c', 'post-d'].map((slug) =>
        BlogPostBuilder.published(slug).withTags(['ddd']).now(),
      ),
    ]);

    expect(
      await slugs(useCase.execute({ slug: 'target', locale: 'en-US' })),
    ).toHaveLength(DEFAULT_RELATED_LIMIT);
  });

  it('should honour a custom limit when one is given', async () => {
    const useCase = useCaseOver([
      target,
      BlogPostBuilder.published('post-a').withTags(['ddd']).now(),
      BlogPostBuilder.published('post-b').withTags(['ddd']).now(),
    ]);

    expect(
      await slugs(
        useCase.execute({ slug: 'target', locale: 'en-US', limit: 1 }),
      ),
    ).toHaveLength(1);
  });

  it('should map posts to summaries in the requested locale', async () => {
    const useCase = useCaseOver([
      target,
      BlogPostBuilder.build()
        .withSlug('related')
        .withTags(['ddd'])
        .withStatus(BlogPostStatus.PUBLISHED)
        .withTitle({
          'en-US': 'Related',
          'pt-BR': 'Relacionado',
          es: 'Relacionado',
        })
        .now(),
    ]);

    const result = await useCase.execute({ slug: 'target', locale: 'pt-BR' });

    expect(result.isRight() && result.value[0]?.title).toBe('Relacionado');
  });

  it('should return NotFoundError when the slug is a DRAFT post', async () => {
    const useCase = useCaseOver([
      BlogPostBuilder.draft('draft').withTags(['ddd']).now(),
      BlogPostBuilder.published('other').withTags(['ddd']).now(),
    ]);

    const result = await useCase.execute({ slug: 'draft', locale: 'en-US' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return NotFoundError when the slug is not among the posts', async () => {
    const useCase = useCaseOver([
      BlogPostBuilder.published('other').withTags(['ddd']).now(),
    ]);

    const result = await useCase.execute({ slug: 'missing', locale: 'en-US' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return Left(ValidationError) for a malformed slug', async () => {
    const repo = makeBlogPostRepository();

    const result = await new ListRelatedBlogPosts(repo).execute({
      slug: 'Not A Slug!',
      locale: 'en-US',
    });

    expect(result.isLeft() && result.value.code).toBe('INVALID_SLUG');
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('should return Left(FETCH_FAILED) when the repository throws', async () => {
    const repo = makeBlogPostRepository({
      findAll: vi.fn().mockRejectedValue(new Error('db down')),
    });

    const result = await new ListRelatedBlogPosts(repo).execute({
      slug: 'target',
      locale: 'en-US',
    });

    expect(result.isLeft() && result.value.code).toBe('FETCH_FAILED');
  });
});
