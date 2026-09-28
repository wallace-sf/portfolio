import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const theEitherPatternInTypescript: BlogPostSeed = {
  id: ID.blogPosts.theEitherPatternInTypescript,
  slug: 'the-either-pattern-in-typescript',
  title: loc(
    'The Either Pattern in TypeScript',
    'O Padrão Either em TypeScript',
    'El Patrón Either en TypeScript',
  ),
  description: loc(
    'Why this codebase never throws for business-rule errors, and how a two-value Either type makes failure a first-class citizen of the type system.',
    'Por que esse código nunca usa throw para erros de regra de negócio, e como um tipo Either de dois valores transforma a falha em cidadã de primeira classe do sistema de tipos.',
    'Por qué este código nunca usa throw para errores de reglas de negocio, y cómo un tipo Either de dos valores convierte el fallo en un ciudadano de primera clase del sistema de tipos.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['typescript', 'ddd', 'architecture'],
  publishedAt: new Date('2026-08-01T00:00:00Z'),
  featured: true,
  coverImage: {
    url: 'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/blog/the-either-pattern-in-typescript/cover.webp',
    alt: loc(
      'The Either Pattern in TypeScript — article cover',
      'O padrão Either em TypeScript — capa do artigo',
      'El patrón Either en TypeScript — portada del artículo',
    ),
  },
  thumbnailImage: {
    url: 'https://daxmkexweadrkobbnuxj.supabase.co/storage/v1/object/public/portfolio-images/blog/the-either-pattern-in-typescript/thumbnail.webp',
    alt: loc(
      'The Either Pattern in TypeScript — article thumbnail',
      'O padrão Either em TypeScript — miniatura do artigo',
      'El patrón Either en TypeScript — miniatura del artículo',
    ),
  },
};
