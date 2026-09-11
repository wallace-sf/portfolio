import { beforeEach, describe, expect, it } from 'vitest';

import { BlogPostStatus } from '@repo/core/blog';
import { Slug } from '@repo/core/shared';

import { prisma } from '../../../src/prisma/client';
import { PrismaBlogPostRepository } from '../../../src/repositories/blog/PrismaBlogPostRepository';
import { buildPrismaBlogPost } from '../../factories/prisma-blog-post.factory';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL not set — integration tests require a live database',
  );
}

describe('PrismaBlogPostRepository (integration)', () => {
  const repo = new PrismaBlogPostRepository(prisma);

  beforeEach(async () => {
    await prisma.blogPost.deleteMany({});
  });

  describe('findAll', () => {
    it('should return all non-deleted posts ordered by publishedAt desc', async () => {
      const post1 = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000001',
        slug: 'post-1',
        publishedAt: new Date('2026-01-01'),
      });
      const post2 = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000002',
        slug: 'post-2',
        publishedAt: new Date('2026-01-15'),
      });
      const post3 = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000003',
        slug: 'post-3',
        publishedAt: new Date('2026-01-10'),
      });

      await prisma.blogPost.createMany({ data: [post1, post2, post3] });

      const posts = await repo.findAll();

      expect(posts).toHaveLength(3);
      expect(posts[0]!.slug.value).toBe('post-2');
      expect(posts[1]!.slug.value).toBe('post-3');
      expect(posts[2]!.slug.value).toBe('post-1');
    });

    it('should exclude soft-deleted posts from results', async () => {
      const activePost = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000001',
        slug: 'active-post',
        deletedAt: null,
      });
      const deletedPost = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000002',
        slug: 'deleted-post',
        deletedAt: new Date(),
      });

      await prisma.blogPost.createMany({ data: [activePost, deletedPost] });

      const posts = await repo.findAll();

      expect(posts).toHaveLength(1);
      expect(posts[0]!.slug.value).toBe('active-post');
    });

    it('should return posts with any status (DRAFT, PUBLISHED, ARCHIVED)', async () => {
      const draft = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000001',
        slug: 'draft-post',
        status: 'DRAFT',
        tags: [],
      });
      const published = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000002',
        slug: 'published-post',
        status: 'PUBLISHED',
      });
      const archived = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000003',
        slug: 'archived-post',
        status: 'ARCHIVED',
      });

      await prisma.blogPost.createMany({ data: [draft, published, archived] });

      const posts = await repo.findAll();

      expect(posts).toHaveLength(3);
      expect(posts.some((p) => p.status === BlogPostStatus.DRAFT)).toBe(true);
      expect(posts.some((p) => p.status === BlogPostStatus.PUBLISHED)).toBe(
        true,
      );
      expect(posts.some((p) => p.status === BlogPostStatus.ARCHIVED)).toBe(
        true,
      );
    });

    it('should return empty array when no posts exist', async () => {
      const posts = await repo.findAll();

      expect(posts).toEqual([]);
    });
  });

  describe('findBySlug', () => {
    it('should return BlogPost when slug exists and post is not deleted', async () => {
      const row = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000001',
        slug: 'existing-post',
        deletedAt: null,
      });

      await prisma.blogPost.create({ data: row });

      const result = Slug.create('existing-post');
      expect(result.isRight()).toBe(true);
      const slug = result.value as Slug;

      const post = await repo.findBySlug(slug);

      expect(post).not.toBeNull();
      expect(post!.slug.value).toBe('existing-post');
    });

    it('should return null when slug does not exist', async () => {
      const result = Slug.create('non-existent');
      expect(result.isRight()).toBe(true);
      const slug = result.value as Slug;

      const post = await repo.findBySlug(slug);

      expect(post).toBeNull();
    });

    it('should return null when post with slug is soft-deleted', async () => {
      const row = buildPrismaBlogPost({
        id: '00000000-0000-0000-0000-000000000001',
        slug: 'deleted-post',
        deletedAt: new Date(),
      });

      await prisma.blogPost.create({ data: row });

      const result = Slug.create('deleted-post');
      expect(result.isRight()).toBe(true);
      const slug = result.value as Slug;

      const post = await repo.findBySlug(slug);

      expect(post).toBeNull();
    });
  });
});
