import { describe, expect, it, vi } from 'vitest';

import { BlogPost, IBlogPostProps } from '@repo/core/blog';

import { IBlogPostRepository } from '~/blog/ports';
import { ListBlogPosts } from '~/blog/use-cases/ListBlogPosts';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_PROPS: IBlogPostProps = {
  slug: 'my-first-post',
  title: {
    'en-US': 'My First Post',
    'pt-BR': 'Meu Primeiro Post',
    es: 'Mi Primer Post',
  },
  description: {
    'en-US': 'A short description.',
    'pt-BR': 'Uma descrição curta.',
    es: 'Una descripción corta.',
  },
  content: {
    'en-US': 'Full content.',
    'pt-BR': 'Conteúdo completo.',
    es: 'Contenido completo.',
  },
  tags: ['nextjs', 'architecture'],
  publishedAt: '2026-08-01T00:00:00.000Z',
};

function makeBlogPost(overrides: Partial<IBlogPostProps> = {}): BlogPost {
  const result = BlogPost.create({ ...BASE_PROPS, ...overrides });
  if (result.isLeft())
    throw new Error(`makeBlogPost failed: ${result.value.message}`);
  return result.value;
}

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
      const post = makeBlogPost();
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
          tags: ['nextjs', 'architecture'],
          coverImage: undefined,
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

    it('should include cover and thumbnail images with alt resolved to the locale', async () => {
      const post = makeBlogPost({
        coverImage: {
          url: 'https://example.com/cover.png',
          alt: { 'en-US': 'Cover', 'pt-BR': 'Capa', es: 'Portada' },
        },
        thumbnailImage: {
          url: 'https://example.com/thumb.png',
          alt: { 'en-US': 'Thumb', 'pt-BR': 'Miniatura', es: 'Miniatura' },
        },
      });
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
