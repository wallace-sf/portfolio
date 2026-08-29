import { describe, expect, it } from 'vitest';

import { InfrastructureError } from '../../../src/errors/InfrastructureError';
import {
  BlogPostMapper,
  ParsedLocaleFiles,
} from '../../../src/repositories/blog/BlogPostMapper';
import { MetaJson } from '../../../src/repositories/blog/schemas';

function buildMeta(overrides: Partial<MetaJson> = {}): MetaJson {
  return {
    slug: 'test-post',
    publishedAt: '2026-08-01',
    tags: ['nextjs', 'architecture'],
    ...overrides,
  };
}

function buildLocales(
  overrides: Partial<ParsedLocaleFiles> = {},
): ParsedLocaleFiles {
  return {
    'en-US': {
      title: 'Test Post',
      description: 'Test description',
      content: '# Test Post\n\nEnglish body.',
    },
    'pt-BR': {
      title: 'Post de Teste',
      description: 'Descrição de teste',
      content: '# Post de Teste\n\nCorpo em português.',
    },
    es: {
      title: 'Publicación de Prueba',
      description: 'Descripción de prueba',
      content: '# Publicación de Prueba\n\nCuerpo en español.',
    },
    ...overrides,
  };
}

describe('BlogPostMapper', () => {
  describe('toDomain', () => {
    const coverImage = {
      url: 'https://x.supabase.co/storage/v1/object/public/portfolio-images/blog/test-post/cover.webp',
      alt: { 'en-US': 'Cover', 'pt-BR': 'Capa', es: 'Portada' },
    };
    const thumbnailImage = {
      url: 'https://x.supabase.co/storage/v1/object/public/portfolio-images/blog/test-post/thumbnail.webp',
      alt: { 'en-US': 'Thumb', 'pt-BR': 'Miniatura', es: 'Miniatura' },
    };

    it('should map meta and parsed locale files to a domain BlogPost', () => {
      const meta = buildMeta({ coverImage, thumbnailImage });
      const locales = buildLocales();

      const post = BlogPostMapper.toDomain(meta, locales);

      expect(post.slug.value).toBe('test-post');
      expect(post.title.get('en-US')).toBe('Test Post');
      expect(post.title.get('pt-BR')).toBe('Post de Teste');
      expect(post.title.get('es')).toBe('Publicación de Prueba');
      expect(post.description.get('en-US')).toBe('Test description');
      expect(post.content.get('en-US')).toContain('English body.');
      expect(post.tags.map((t) => t.value)).toEqual(['nextjs', 'architecture']);
      expect(post.publishedAt.value).toBe('2026-08-01');
      expect(post.coverImage?.url.value).toBe(coverImage.url);
      expect(post.coverImage?.alt.get('pt-BR')).toBe('Capa');
      expect(post.thumbnailImage?.url.value).toBe(thumbnailImage.url);
    });

    it('should map a post with no images to a BlogPost without cover or thumbnail', () => {
      const post = BlogPostMapper.toDomain(buildMeta(), buildLocales());

      expect(post.coverImage).toBeUndefined();
      expect(post.thumbnailImage).toBeUndefined();
    });

    it('should throw InfrastructureError when meta and locale data produce an invalid domain object', () => {
      const meta = buildMeta({ slug: '' });
      const locales = buildLocales();

      expect(() => BlogPostMapper.toDomain(meta, locales)).toThrow(
        InfrastructureError,
      );
    });
  });
});
