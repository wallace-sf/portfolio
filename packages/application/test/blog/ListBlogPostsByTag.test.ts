import { BlogPost, Tag } from '@repo/core/blog';
import { DomainError, ValidationError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ListBlogPostsByTag } from '~/blog/use-cases/ListBlogPostsByTag';
import { ApplicationErrorCode } from '~/shared/ApplicationErrorCode';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

const useCaseOver = (posts: BlogPost[]) =>
  new ListBlogPostsByTag(
    makeBlogPostRepository({ findAll: vi.fn().mockResolvedValue(posts) }),
  );

describe('ListBlogPostsByTag', () => {
  it("should list the tag's published posts newest first when posts have mixed tags and statuses", async () => {
    const result = await useCaseOver([
      BlogPostBuilder.published('older-ddd', '2026-08-01T00:00:00.000Z')
        .withTags(['ddd'])
        .now(),
      BlogPostBuilder.published('other-tag', '2026-09-01T00:00:00.000Z')
        .withTags(['nextjs'])
        .now(),
      BlogPostBuilder.published('newer-ddd', '2026-10-01T00:00:00.000Z')
        .withTags(['ddd', 'typescript'])
        .now(),
      BlogPostBuilder.draft('draft-ddd', '2026-10-05T00:00:00.000Z')
        .withTags(['ddd'])
        .now(),
    ]).execute({ tag: 'ddd', locale: 'pt-BR' });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value.map(({ slug }) => slug)).toEqual([
      'newer-ddd',
      'older-ddd',
    ]);
  });

  it('should return an empty list when no published post has the tag', async () => {
    const result = await useCaseOver([
      BlogPostBuilder.published('nextjs-post', '2026-08-01T00:00:00.000Z')
        .withTags(['nextjs'])
        .now(),
    ]).execute({ tag: 'ddd', locale: 'en-US' });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value).toEqual([]);
  });

  it('should return a validation error when the tag is malformed', async () => {
    const repo = makeBlogPostRepository();

    const result = await new ListBlogPostsByTag(repo).execute({
      tag: 'Not A Tag',
      locale: 'en-US',
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(ValidationError);
    expect(result.value.code).toBe(Tag.ERROR_CODE);
    expect(repo.findAll).not.toHaveBeenCalled();
  });

  it('should return FETCH_FAILED when the repository throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const repo = makeBlogPostRepository({
      findAll: vi.fn().mockRejectedValue(new Error('db down')),
    });

    const result = await new ListBlogPostsByTag(repo).execute({
      tag: 'ddd',
      locale: 'en-US',
    });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(DomainError);
    expect(result.value.code).toBe(ApplicationErrorCode.FETCH_FAILED);
  });
});
