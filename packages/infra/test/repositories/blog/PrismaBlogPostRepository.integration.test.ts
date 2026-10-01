import { Prisma, PrismaClient } from '@prisma/client';
import { BlogPostStatus } from '@repo/core/blog';
import { Slug } from '@repo/core/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { PrismaBlogPostRepository } from '../../../src/repositories/blog/PrismaBlogPostRepository';
import { buildPrismaBlogPost } from '../../factories/prisma-blog-post.factory';
import { withRollback } from '../../support/withRollback';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

// Skipped as a whole (hooks included) when there is no reachable database —
// a fresh clone or a paused dev project must not fail the @repo/infra suite.
// Run explicitly with `pnpm --filter @repo/infra test:integration`.
const missingDbEnv = !process.env.DIRECT_URL;

type PrismaBlogPostRow = ReturnType<typeof buildPrismaBlogPost>;

function toCreateInput(row: PrismaBlogPostRow): Prisma.BlogPostCreateManyInput {
  return {
    ...row,
    title: row.title as Prisma.InputJsonValue,
    description: row.description as Prisma.InputJsonValue,
    content: row.content as Prisma.InputJsonValue,
    author: row.author as Prisma.InputJsonValue,
    coverImageAlt:
      (row.coverImageAlt as Prisma.InputJsonValue | null) ?? Prisma.JsonNull,
    thumbnailImageAlt:
      (row.thumbnailImageAlt as Prisma.InputJsonValue | null) ??
      Prisma.JsonNull,
  };
}

function buildRow(overrides: Partial<PrismaBlogPostRow>) {
  return buildPrismaBlogPost({ id: crypto.randomUUID(), ...overrides });
}

function slugOf(raw: string): Slug {
  const result = Slug.create(raw);
  if (result.isLeft()) throw result.value;
  return result.value;
}

type Ctx = { tx: PrismaClient; repo: PrismaBlogPostRepository };

/**
 * Runs a test against an empty `BlogPost` table inside a rolled-back
 * transaction: the dev posts are hidden from the test, never deleted.
 */
function inEmptyTable(fn: (ctx: Ctx) => Promise<void>) {
  return () =>
    withRollback(db, async (tx) => {
      await tx.blogPost.deleteMany({});
      await fn({ tx, repo: new PrismaBlogPostRepository(tx) });
    });
}

beforeAll(async () => {
  if (missingDbEnv) return;
  await db.$connect();
});

afterAll(async () => {
  if (missingDbEnv) return;
  await db.$disconnect();
});

describe.skipIf(missingDbEnv)('PrismaBlogPostRepository (integration)', () => {
  describe('findAll', () => {
    it(
      'should return all non-deleted posts ordered by publishedAt desc',
      inEmptyTable(async ({ tx, repo }) => {
        await tx.blogPost.createMany({
          data: [
            buildRow({ slug: 'post-1', publishedAt: new Date('2026-01-01') }),
            buildRow({ slug: 'post-2', publishedAt: new Date('2026-01-15') }),
            buildRow({ slug: 'post-3', publishedAt: new Date('2026-01-10') }),
          ].map(toCreateInput),
        });

        const posts = await repo.findAll();

        expect(posts.map((p) => p.slug.value)).toEqual([
          'post-2',
          'post-3',
          'post-1',
        ]);
      }),
    );

    it(
      'should exclude soft-deleted posts from results',
      inEmptyTable(async ({ tx, repo }) => {
        await tx.blogPost.createMany({
          data: [
            buildRow({ slug: 'active-post', deletedAt: null }),
            buildRow({ slug: 'deleted-post', deletedAt: new Date() }),
          ].map(toCreateInput),
        });

        const posts = await repo.findAll();

        expect(posts).toHaveLength(1);
        expect(posts[0]!.slug.value).toBe('active-post');
      }),
    );

    it(
      'should return posts with any status (DRAFT, PUBLISHED, ARCHIVED)',
      inEmptyTable(async ({ tx, repo }) => {
        await tx.blogPost.createMany({
          data: [
            buildRow({ slug: 'draft-post', status: 'DRAFT', tags: [] }),
            buildRow({ slug: 'published-post', status: 'PUBLISHED' }),
            buildRow({ slug: 'archived-post', status: 'ARCHIVED' }),
          ].map(toCreateInput),
        });

        const posts = await repo.findAll();

        expect(posts.map((p) => p.status).sort()).toEqual(
          [
            BlogPostStatus.ARCHIVED,
            BlogPostStatus.DRAFT,
            BlogPostStatus.PUBLISHED,
          ].sort(),
        );
      }),
    );

    it(
      'should return empty array when no posts exist',
      inEmptyTable(async ({ repo }) => {
        const posts = await repo.findAll();

        expect(posts).toEqual([]);
      }),
    );
  });

  describe('findBySlug', () => {
    it(
      'should return BlogPost when slug exists and post is not deleted',
      inEmptyTable(async ({ tx, repo }) => {
        await tx.blogPost.create({
          data: toCreateInput(
            buildRow({ slug: 'existing-post', deletedAt: null }),
          ),
        });

        const post = await repo.findBySlug(slugOf('existing-post'));

        expect(post).not.toBeNull();
        expect(post!.slug.value).toBe('existing-post');
      }),
    );

    it(
      'should return null when slug does not exist',
      inEmptyTable(async ({ repo }) => {
        const post = await repo.findBySlug(slugOf('non-existent'));

        expect(post).toBeNull();
      }),
    );

    it(
      'should return null when post with slug is soft-deleted',
      inEmptyTable(async ({ tx, repo }) => {
        await tx.blogPost.create({
          data: toCreateInput(
            buildRow({ slug: 'deleted-post', deletedAt: new Date() }),
          ),
        });

        const post = await repo.findBySlug(slugOf('deleted-post'));

        expect(post).toBeNull();
      }),
    );
  });
});
