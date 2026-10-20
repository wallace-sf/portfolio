import { describe, expect, it, vi } from 'vitest';

import { Prisma, type PrismaClient } from '@prisma/client';

import { seedBlogPosts } from '../../prisma/seed-data/blog-posts/seedBlogPosts';
import { ID } from '../../prisma/seeders';
import { BlogPostMapper } from '../../src/repositories/blog/BlogPostMapper';
import { buildPrismaBlogPost } from '../factories/prisma-blog-post.factory';

const LOCALES = ['en-US', 'pt-BR', 'es'] as const;

type UpsertArgs = Prisma.BlogPostUpsertArgs;
type DeleteManyArgs = Prisma.BlogPostDeleteManyArgs;

interface SeedCalls {
  upserts: UpsertArgs[];
  deletes: DeleteManyArgs[];
}

async function runSeedCalls(): Promise<SeedCalls> {
  const upserts: UpsertArgs[] = [];
  const deletes: DeleteManyArgs[] = [];
  const db = {
    blogPost: {
      deleteMany: vi.fn(async (args: DeleteManyArgs) => {
        deletes.push(args);
        return { count: 0 };
      }),
      upsert: vi.fn(async (args: UpsertArgs) => {
        upserts.push(args);
      }),
    },
  } as unknown as PrismaClient;

  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await seedBlogPosts(db);
  return { upserts, deletes };
}

async function runSeed(): Promise<UpsertArgs[]> {
  return (await runSeedCalls()).upserts;
}

function localized(value: unknown): Record<string, string> {
  return value as Record<string, string>;
}

function jsonOrNull(value: unknown): Prisma.JsonValue {
  return value === Prisma.JsonNull ? null : (value as Prisma.JsonValue);
}

describe('seedBlogPosts', () => {
  it('should upsert every blog post by its stable id when run', async () => {
    const calls = await runSeed();

    expect(calls.map((c) => c.where.id).sort()).toEqual(
      Object.values(ID.blogPosts).sort(),
    );
  });

  it('should seed posts that map to valid domain BlogPosts when read back', async () => {
    const calls = await runSeed();

    for (const { create } of calls) {
      const row = buildPrismaBlogPost({
        ...(create as Partial<ReturnType<typeof buildPrismaBlogPost>>),
        coverImageAlt: jsonOrNull(create.coverImageAlt),
        thumbnailImageAlt: jsonOrNull(create.thumbnailImageAlt),
      });

      expect(() => BlogPostMapper.toDomain(row)).not.toThrow();
    }
  });

  it('should prune every blog post outside the seed list when run', async () => {
    const { deletes } = await runSeedCalls();

    expect(deletes).toEqual([
      { where: { id: { notIn: Object.values(ID.blogPosts) } } },
    ]);
  });

  it('should seed cover and thumbnail images when the post has them', async () => {
    const calls = await runSeed();
    const bySlug = new Map(calls.map(({ create }) => [create.slug, create]));

    const studioMir = bySlug.get('studio-mir-experiencia-digital');
    expect(studioMir?.coverImageUrl).toMatch(
      /\/blog\/studio-mir-experiencia-digital\/cover\.webp$/,
    );
    expect(studioMir?.thumbnailImageUrl).toMatch(
      /\/blog\/studio-mir-experiencia-digital\/thumbnail-v3\.webp$/,
    );
  });

  it('should seed the full article body in every locale when content is migrated', async () => {
    const calls = await runSeed();

    for (const { create } of calls) {
      const content = localized(create.content);
      for (const locale of LOCALES) {
        const body = content[locale] ?? '';
        expect(
          body.split(/\s+/).length,
          `${create.slug} ${locale}`,
        ).toBeGreaterThan(150);
        expect(body).not.toMatch(/coming soon|em breve|próximamente/i);
        expect(body.startsWith('---')).toBe(false);
      }
    }
  });

  it('should seed titles without wrapping quotes when titles come from the source', async () => {
    const calls = await runSeed();

    for (const { create } of calls) {
      for (const title of Object.values(localized(create.title))) {
        expect(title).not.toMatch(/^["'].*["']$/);
      }
    }
  });

  it('should link the author to the public site domain when seeding', async () => {
    const calls = await runSeed();

    for (const { create } of calls) {
      expect(create.author).toMatchObject({
        url: 'https://wallace-ferreira.dev',
        avatarUrl: 'https://github.com/wallace-sf.png',
      });
    }
  });
});
