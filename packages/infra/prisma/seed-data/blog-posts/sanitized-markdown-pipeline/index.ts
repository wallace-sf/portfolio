import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const sanitizedMarkdownPipeline: BlogPostSeed = {
  id: ID.blogPosts.sanitizedMarkdownPipeline,
  slug: 'sanitized-markdown-pipeline',
  title: loc(
    'A Sanitized Markdown Pipeline',
    'Um pipeline de Markdown sanitizado',
    'Un pipeline de Markdown sanitizado',
  ),
  description: loc(
    'Why post bodies moved from MDX to Markdown, and why sanitizing right after parsing, before any trusted transform, is what keeps the pipeline safe.',
    'Por que o corpo dos posts trocou MDX por Markdown, e por que sanitizar logo depois do parse, antes de qualquer transformação confiável, é o que mantém o pipeline seguro.',
    'Por qué el cuerpo de los posts pasó de MDX a Markdown, y por qué sanitizar justo después del parse, antes de cualquier transformación confiable, es lo que mantiene seguro el pipeline.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['markdown', 'security', 'nextjs'],
  publishedAt: new Date('2026-10-16T00:00:00Z'),
  featured: false,
};
