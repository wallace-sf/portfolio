import { BlogPostStatus } from '@repo/core/blog';
import { NotFoundError } from '@repo/core/shared';
import { BlogPostBuilder } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { IBlogPostRepository } from '~/blog/ports';
import { GetBlogPostBySlug } from '~/blog/use-cases/GetBlogPostBySlug';

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

describe('GetBlogPostBySlug', () => {
  describe('execute()', () => {
    it('should return Right with BlogPostDetailDTO when the post is found', async () => {
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
        .withContent({
          'en-US': 'Full content.',
          'pt-BR': 'Conteúdo completo.',
          es: 'Contenido completo.',
        })
        .withTags(['nextjs', 'architecture'])
        .withAuthor(AUTHOR)
        .withPublishedAt('2026-08-01T00:00:00.000Z')
        .now();
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
        featured: false,
        tags: ['nextjs', 'architecture'],
        author: {
          name: 'Test Author',
          avatarUrl: 'https://example.com/avatar.jpg',
          url: 'https://example.com',
          bio: undefined,
        },
        coverImage: undefined,
        thumbnailImage: undefined,
        content: 'Conteúdo completo.',
        updatedAt: undefined,
      });
    });

    it('should include author bio resolved to the locale and updatedAt when present', async () => {
      const post = published()
        .withAuthor({
          ...AUTHOR,
          bio: {
            'en-US': 'An author bio.',
            'pt-BR': 'Uma biografia do autor.',
            es: 'Una biografía del autor.',
          },
        })
        .withPostUpdatedAt('2026-08-15T00:00:00.000Z')
        .now();
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(post),
      });

      const result = await new GetBlogPostBySlug(repo).execute({
        slug: 'my-first-post',
        locale: 'pt-BR',
      });

      expect(result.isRight()).toBe(true);
      if (!result.isRight()) return;
      expect(result.value.author.bio).toBe('Uma biografia do autor.');
      expect(result.value.updatedAt).toBe('2026-08-15T00:00:00.000Z');
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

    it('should return Left(NotFoundError) when the found post is DRAFT', async () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.DRAFT)
        .withTags([])
        .now();
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(post),
      });

      const result = await new GetBlogPostBySlug(repo).execute({
        slug: 'my-first-post',
        locale: 'en-US',
      });

      expect(result.isLeft()).toBe(true);
      if (!result.isLeft()) return;
      expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return Left(NotFoundError) when the found post is ARCHIVED', async () => {
      const post = BlogPostBuilder.build()
        .withStatus(BlogPostStatus.ARCHIVED)
        .now();
      const repo = makeRepository({
        findBySlug: vi.fn().mockResolvedValue(post),
      });

      const result = await new GetBlogPostBySlug(repo).execute({
        slug: 'my-first-post',
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
