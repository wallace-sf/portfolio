import { describe, expect, it } from 'vitest';

import { BlogPostStatus } from '@repo/core/blog';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import { BlogPostMapper } from '../../../src/repositories/blog/BlogPostMapper';
import { buildPrismaBlogPost } from '../../factories/prisma-blog-post.factory';

describe('BlogPostMapper', () => {
  describe('toDomain', () => {
    it('should map a Prisma row to a domain BlogPost with all fields', () => {
      const row = buildPrismaBlogPost({
        slug: 'test-post',
        status: 'PUBLISHED',
        tags: ['nextjs', 'architecture'],
        author: {
          name: 'Test Author',
          avatarUrl: 'https://example.com/avatar.jpg',
          url: 'https://example.com',
        },
        coverImageUrl:
          'https://x.supabase.co/storage/v1/object/public/portfolio-images/blog/test-post/cover.webp',
        coverImageAlt: { 'en-US': 'Cover', 'pt-BR': 'Capa', es: 'Portada' },
        thumbnailImageUrl:
          'https://x.supabase.co/storage/v1/object/public/portfolio-images/blog/test-post/thumbnail.webp',
        thumbnailImageAlt: {
          'en-US': 'Thumb',
          'pt-BR': 'Miniatura',
          es: 'Miniatura',
        },
        publishedAt: new Date('2026-08-01T00:00:00Z'),
      });

      const post = BlogPostMapper.toDomain(row);

      expect(post.slug.value).toBe('test-post');
      expect(post.title.get('en-US')).toBe('Test Post');
      expect(post.title.get('pt-BR')).toBe('Post de Teste');
      expect(post.title.get('es')).toBe('Publicación de Prueba');
      expect(post.description.get('en-US')).toBe('Test description');
      expect(post.content.get('en-US')).toContain('Test content');
      expect(post.tags.map((t) => t.value)).toEqual(['nextjs', 'architecture']);
      expect(post.author.name.value).toBe('Test Author');
      expect(post.author.avatarUrl.value).toBe('https://example.com/avatar.jpg');
      expect(post.publishedAt.value).toBe('2026-08-01T00:00:00.000Z');
      expect(post.status).toBe(BlogPostStatus.PUBLISHED);
      expect(post.coverImage?.url.value).toContain('cover.webp');
      expect(post.coverImage?.alt.get('pt-BR')).toBe('Capa');
      expect(post.thumbnailImage?.url.value).toContain('thumbnail.webp');
    });

    it('should map row status to domain BlogPostStatus (DRAFT, PUBLISHED, ARCHIVED)', () => {
      const draftPost = BlogPostMapper.toDomain(
        buildPrismaBlogPost({ status: 'DRAFT' }),
      );
      const publishedPost = BlogPostMapper.toDomain(
        buildPrismaBlogPost({ status: 'PUBLISHED' }),
      );
      const archivedPost = BlogPostMapper.toDomain(
        buildPrismaBlogPost({ status: 'ARCHIVED' }),
      );

      expect(draftPost.status).toBe(BlogPostStatus.DRAFT);
      expect(publishedPost.status).toBe(BlogPostStatus.PUBLISHED);
      expect(archivedPost.status).toBe(BlogPostStatus.ARCHIVED);
    });

    it('should map author JSON to Author value object', () => {
      const row = buildPrismaBlogPost({
        author: {
          name: 'Jane Doe',
          avatarUrl: 'https://example.com/jane.jpg',
          url: 'https://janedoe.com',
        },
      });

      const post = BlogPostMapper.toDomain(row);

      expect(post.author.name.value).toBe('Jane Doe');
      expect(post.author.avatarUrl.value).toBe('https://example.com/jane.jpg');
      expect(post.author.url?.value).toBe('https://janedoe.com');
    });

    it('should map a post with no images to a BlogPost without cover or thumbnail', () => {
      const row = buildPrismaBlogPost({
        coverImageUrl: null,
        coverImageAlt: null,
        thumbnailImageUrl: null,
        thumbnailImageAlt: null,
      });

      const post = BlogPostMapper.toDomain(row);

      expect(post.coverImage).toBeUndefined();
      expect(post.thumbnailImage).toBeUndefined();
    });

    it('should throw InfrastructureError when row data violates domain rules', () => {
      const row = buildPrismaBlogPost({
        slug: '',
      });

      expect(() => BlogPostMapper.toDomain(row)).toThrow(InfrastructureError);
    });

    it('should throw InfrastructureError when PUBLISHED post has empty tags array', () => {
      const row = buildPrismaBlogPost({
        status: 'PUBLISHED',
        tags: [],
      });

      expect(() => BlogPostMapper.toDomain(row)).toThrow(InfrastructureError);
    });
  });
});
