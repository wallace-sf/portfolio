import { describe, expect, it, vi } from 'vitest';

import { BlogPost, IBlogPostProps } from '@repo/core/blog';
import { NotFoundError } from '@repo/core/shared';

import { IBlogPostRepository } from '~/blog/ports';
import { GetBlogPostBySlug } from '~/blog/use-cases/GetBlogPostBySlug';

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

describe('GetBlogPostBySlug', () => {
  describe('execute()', () => {
    it('should return Right with BlogPostDetailDTO when the post is found', async () => {
      const post = makeBlogPost();
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(post),
      });
      const useCase = new GetBlogPostBySlug(repo);

      const result = await useCase.execute({
        slug: 'my-first-post',
        locale: 'pt-BR',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value).toEqual({
        slug: 'my-first-post',
        title: 'Meu Primeiro Post',
        description: 'Uma descrição curta.',
        publishedAt: '2026-08-01T00:00:00.000Z',
        tags: ['nextjs', 'architecture'],
        coverImage: undefined,
        content: 'Conteúdo completo.',
      });
    });

    it('should return Left(NotFoundError) when the post does not exist', async () => {
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(null),
      });
      const useCase = new GetBlogPostBySlug(repo);

      const result = await useCase.execute({
        slug: 'missing-post',
        locale: 'en-US',
      });

      expect(result.isLeft()).toBe(true);
      if (!result.isLeft()) return;
      expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return Left(ValidationError) for an invalid slug', async () => {
      const repo = makeRepository();
      const useCase = new GetBlogPostBySlug(repo);

      const result = await useCase.execute({
        slug: 'Not A Slug',
        locale: 'en-US',
      });

      expect(result.isLeft()).toBe(true);
      expect(repo.findBySlug).not.toHaveBeenCalled();
    });

    it('should return Left(DomainError) when the repository throws', async () => {
      const repo = makeRepository({
        findBySlug: vi.fn().mockRejectedValue(new Error('db down')),
      });
      const useCase = new GetBlogPostBySlug(repo);

      const result = await useCase.execute({
        slug: 'my-first-post',
        locale: 'en-US',
      });

      expect(result.isLeft()).toBe(true);
      if (!result.isLeft()) return;
      expect(result.value.code).toBe('FETCH_FAILED');
    });
  });
});
