import type { BlogPost as PrismaBlogPost, BlogPostStatus, Prisma } from '@prisma/client';

export function buildPrismaBlogPost(
  overrides: Partial<PrismaBlogPost> = {},
): PrismaBlogPost {
  const now = new Date();

  return {
    id: '550e8400-e29b-41d4-a716-446655440000',
    slug: 'test-post',
    title: {
      'en-US': 'Test Post',
      'pt-BR': 'Post de Teste',
      es: 'Publicación de Prueba',
    } as Prisma.JsonObject,
    description: {
      'en-US': 'Test description',
      'pt-BR': 'Descrição de teste',
      es: 'Descripción de prueba',
    } as Prisma.JsonObject,
    content: {
      'en-US': '# Test content',
      'pt-BR': '# Conteúdo de teste',
      es: '# Contenido de prueba',
    } as Prisma.JsonObject,
    tags: ['test', 'unit'],
    author: {
      name: 'Test Author',
      avatarUrl: 'https://example.com/avatar.jpg',
      url: 'https://example.com',
    } as Prisma.JsonObject,
    coverImageUrl: null,
    coverImageAlt: null,
    thumbnailImageUrl: null,
    thumbnailImageAlt: null,
    publishedAt: new Date('2026-01-01T00:00:00Z'),
    status: 'PUBLISHED' as BlogPostStatus,
    featured: false,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    ...overrides,
  };
}
