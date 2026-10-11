import { Prisma } from '@prisma/client';
import type {
  BlogPost as PrismaBlogPost,
  BlogPostStatus,
} from '@prisma/client';

export function buildPrismaBlogPost(
  overrides: Partial<PrismaBlogPost> = {},
): PrismaBlogPost {
  const now = new Date();

  return {
    id: crypto.randomUUID(),
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

/**
 * A factory row as a `create`/`createMany` input: JSON columns cast to
 * `InputJsonValue`, absent image alts as `Prisma.JsonNull`.
 */
export function buildPrismaBlogPostCreateInput(
  overrides: Partial<PrismaBlogPost> = {},
): Prisma.BlogPostCreateManyInput & Pick<PrismaBlogPost, 'id' | 'slug'> {
  const row = buildPrismaBlogPost(overrides);

  return {
    ...row,
    title: row.title as Prisma.InputJsonValue,
    description: row.description as Prisma.InputJsonValue,
    content: row.content as Prisma.InputJsonValue,
    author: row.author as Prisma.InputJsonValue,
    coverImageAlt:
      (row.coverImageAlt as Prisma.InputJsonValue | null) ?? Prisma.JsonNull,
    thumbnailImageAlt:
      (row.thumbnailImageAlt as Prisma.InputJsonValue | null) ??
      Prisma.JsonNull,
  };
}
