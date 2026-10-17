import { BlogPostStatus } from '@repo/core/blog';
import { DomainError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { GetBlogTags } from '~/blog/use-cases/GetBlogTags';
import { ApplicationErrorCode } from '~/shared/ApplicationErrorCode';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

const postWithTags = (
  tags: string[],
  status: BlogPostStatus = BlogPostStatus.PUBLISHED,
) => BlogPostBuilder.build().withStatus(status).withTags(tags).now();

const execute = (posts: ReturnType<typeof postWithTags>[]) =>
  new GetBlogTags(
    makeBlogPostRepository({ findAll: vi.fn().mockResolvedValue(posts) }),
  ).execute({ locale: 'en-US' });

describe('GetBlogTags', () => {
  it('should count each tag over published posts only when drafts and archived posts share tags', async () => {
    const result = await execute([
      postWithTags(['ddd', 'typescript']),
      postWithTags(['ddd']),
      postWithTags(['ddd', 'drafts-only'], BlogPostStatus.DRAFT),
      postWithTags(['typescript'], BlogPostStatus.ARCHIVED),
    ]);

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value).toEqual([
      { tag: 'ddd', count: 2 },
      { tag: 'typescript', count: 1 },
    ]);
  });

  it('should order by count descending, then by tag name when counts tie', async () => {
    const result = await execute([
      postWithTags(['nextjs', 'seo']),
      postWithTags(['nextjs', 'architecture']),
      postWithTags(['monorepo']),
    ]);

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value.map(({ tag }) => tag)).toEqual([
      'nextjs',
      'architecture',
      'monorepo',
      'seo',
    ]);
  });

  it('should return an empty list when there are no published posts', async () => {
    const result = await execute([postWithTags(['ddd'], BlogPostStatus.DRAFT)]);

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value).toEqual([]);
  });

  it('should return FETCH_FAILED when the repository throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const repo = makeBlogPostRepository({
      findAll: vi.fn().mockRejectedValue(new Error('db down')),
    });

    const result = await new GetBlogTags(repo).execute({ locale: 'en-US' });

    expect(result.isLeft()).toBe(true);
    if (!result.isLeft()) return;
    expect(result.value).toBeInstanceOf(DomainError);
    expect(result.value.code).toBe(ApplicationErrorCode.FETCH_FAILED);
  });
});
