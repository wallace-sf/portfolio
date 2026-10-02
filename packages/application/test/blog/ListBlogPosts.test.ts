import { BlogPostStatus } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { IBlogPostRepository } from '~/blog/ports';
import { ListBlogPosts } from '~/blog/use-cases/ListBlogPosts';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AUTHOR = {
  name: 'Test Author',
  avatarUrl: 'https://example.com/avatar.jpg',
  url: 'https://example.com',
};

const published = () =>
  BlogPostBuilder.build().withStatus(BlogPostStatus.PUBLISHED);

function makeRepository(
  overrides: Partial<IBlogPostRepository> = {},
): IBlogPostRepository {
  return {
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ListBlogPosts', () => {
  describe('execute()', () => {
    it('should return Right with BlogPostSummaryDTO[] mapped to the requested locale', async () => {
      const post = published()
        .withSlug('my-first-post')
        .withTitle({
          'en-US': 'My First Post',
          'pt-BR': 'Meu Primeiro Post',
          es: 'Mi Primer Post',
        })
        .withDescription({
          'en-US': 'A short description.',
          'pt-BR': 'Uma descrição curta.',
          es: 'Una descripción corta.',
        })
        .withTags(['nextjs', 'architecture'])
        .withAuthor(AUTHOR)
        .withPublishedAt('2026-08-01T00:00:00.000Z')
        .now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([post]),
      });
      const useCase = new ListBlogPosts(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toEqual([
        {
          slug: 'my-first-post',
          title: 'Meu Primeiro Post',
          description: 'Uma descrição curta.',
          publishedAt: '2026-08-01T00:00:00.000Z',
          featured: false,
          tags: ['nextjs', 'architecture'],
          author: {
            name: 'Test Author',
            avatarUrl: 'https://example.com/avatar.jpg',
            url: 'https://example.com',
          },
          coverImage: undefined,
          thumbnailImage: undefined,
        },
      ]);
    });

    it('should return an empty array when there are no posts', async () => {
      const repo = makeRepository({ findAll: vi.fn().mockResolvedValue([]) });
      const useCase = new ListBlogPosts(repo);

      const result = await useCase.execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toEqual([]);
    });

    it('should order posts newest-first regardless of the repository order', async () => {
      const repo = makeRepository({
        findAll: vi
          .fn()
          .mockResolvedValue([
            published()
              .withSlug('older')
              .withPublishedAt('2026-01-01T00:00:00.000Z')
              .now(),
            published()
              .withSlug('newest')
              .withPublishedAt('2026-12-01T00:00:00.000Z')
              .now(),
            published()
              .withSlug('middle')
              .withPublishedAt('2026-06-01T00:00:00.000Z')
              .now(),
          ]),
      });

      const result = await new ListBlogPosts(repo).execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.map((p) => p.slug)).toEqual([
        'newest',
        'middle',
        'older',
      ]);
    });

    it('should include cover and thumbnail images with alt resolved to the locale', async () => {
      const post = published()
        .withCoverImage({
          url: 'https://example.com/cover.png',
          alt: { 'en-US': 'Cover', 'pt-BR': 'Capa', es: 'Portada' },
        })
        .withThumbnailImage({
          url: 'https://example.com/thumb.png',
          alt: { 'en-US': 'Thumb', 'pt-BR': 'Miniatura', es: 'Miniatura' },
        })
        .now();
      const repo = makeRepository({
        findAll: vi.fn().mockResolvedValue([post]),
      });
      const useCase = new ListBlogPosts(repo);

      const result = await useCase.execute({ locale: 'pt-BR' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value[0]?.coverImage).toEqual({
        url: 'https://example.com/cover.png',
        alt: 'Capa',
      });
      expect(result.value[0]?.thumbnailImage).toEqual({
        url: 'https://example.com/thumb.png',
        alt: 'Miniatura',
      });
    });

    it('should omit DRAFT and ARCHIVED posts from the result', async () => {
      const repo = makeRepository({
        findAll: vi
          .fn()
          .mockResolvedValue([
            published().withSlug('published').now(),
            BlogPostBuilder.build()
              .withSlug('draft')
              .withStatus(BlogPostStatus.DRAFT)
              .withTags([])
              .now(),
            BlogPostBuilder.build()
              .withSlug('archived')
              .withStatus(BlogPostStatus.ARCHIVED)
              .now(),
          ]),
      });

      const result = await new ListBlogPosts(repo).execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.map((p) => p.slug)).toEqual(['published']);
    });

    it('should expose the featured flag from the domain object', async () => {
      const repo = makeRepository({
        findAll: vi
          .fn()
          .mockResolvedValue([published().withFeatured(true).now()]),
      });

      const result = await new ListBlogPosts(repo).execute({ locale: 'en-US' });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value[0]?.featured).toBe(true);
    });

    it('should return Left(DomainError) when the repository throws', async () => {
      const repo = makeRepository({
        findAll: vi.fn().mockRejectedValue(new Error('db down')),
      });
      const useCase = new ListBlogPosts(repo);

      const result = await useCase.execute({ locale: 'en-US' });

      expect(result.isLeft()).toBe(true);
      if (!result.isLeft()) return;
      expect(result.value.code).toBe('FETCH_FAILED');
    });
  });
});
