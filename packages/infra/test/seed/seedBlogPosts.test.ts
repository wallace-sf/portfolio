import { describe, expect, it, vi } from 'vitest';

import { Prisma, type PrismaClient } from '@prisma/client';

import { seedBlogPosts } from '../../prisma/seed-data/blog-posts/seedBlogPosts';
import { ID } from '../../prisma/seeders';
import { BlogPostMapper } from '../../src/repositories/blog/BlogPostMapper';
import { buildPrismaBlogPost } from '../factories/prisma-blog-post.factory';

const LOCALES = ['en-US', 'pt-BR', 'es'] as const;

type UpsertArgs = Prisma.BlogPostUpsertArgs;

async function runSeed(): Promise<UpsertArgs[]> {
  const calls: UpsertArgs[] = [];
  const db = {
    blogPost: {
      upsert: vi.fn(async (args: UpsertArgs) => {
        calls.push(args);
      }),
    },
  } as unknown as PrismaClient;

  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await seedBlogPosts(db);
  return calls;
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

  it('should seed cover and thumbnail only for posts that have them when run', async () => {
    const calls = await runSeed();
    const bySlug = new Map(calls.map(({ create }) => [create.slug, create]));

    const either = bySlug.get('the-either-pattern-in-typescript');
    expect(either?.coverImageUrl).toMatch(
      /\/blog\/the-either-pattern-in-typescript\/cover\.webp$/,
    );
    expect(either?.thumbnailImageUrl).toMatch(
      /\/blog\/the-either-pattern-in-typescript\/thumbnail\.webp$/,
    );

    const withoutImages = bySlug.get('one-validator-one-left');
    expect(withoutImages?.coverImageUrl).toBeNull();
    expect(withoutImages?.thumbnailImageUrl).toBeNull();
    expect(withoutImages?.coverImageAlt).toBe(Prisma.JsonNull);
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
