import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildPrismaBlogPostCreateInput } from '../factories/prisma-blog-post.factory';
import { withRollback } from './withRollback';

// Use DIRECT_URL to bypass PgBouncer — prepared statements don't work with the pooler
const db = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

// Skipped as a whole (hooks included) when there is no reachable database.
// Run explicitly with `pnpm --filter @repo/infra test:integration`.
const missingDbEnv = !process.env.DIRECT_URL;

beforeAll(async () => {
  if (missingDbEnv) return;
  await db.$connect();
});

afterAll(async () => {
  if (missingDbEnv) return;
  await db.$disconnect();
});

describe.skipIf(missingDbEnv)('withRollback (integration)', () => {
  it('should discard rows written inside the callback when it completes', async () => {
    const row = buildPrismaBlogPostCreateInput();

    await withRollback(db, async (tx) => {
      await tx.blogPost.create({ data: row });
      expect(
        await tx.blogPost.findUnique({ where: { id: row.id } }),
      ).not.toBeNull();
    });

    expect(await db.blogPost.findUnique({ where: { id: row.id } })).toBeNull();
  });

  it('should keep existing rows when the callback empties the table', async () => {
    const before = await db.blogPost.count();

    await withRollback(db, async (tx) => {
      await tx.blogPost.deleteMany({});
      expect(await tx.blogPost.count()).toBe(0);
    });

    expect(await db.blogPost.count()).toBe(before);
  });

  it('should rethrow the error and discard writes when the callback throws', async () => {
    const row = buildPrismaBlogPostCreateInput();
    const failure = new Error('assertion failed');

    await expect(
      withRollback(db, async (tx) => {
        await tx.blogPost.create({ data: row });
        throw failure;
      }),
    ).rejects.toBe(failure);

    expect(await db.blogPost.findUnique({ where: { id: row.id } })).toBeNull();
  });
});
