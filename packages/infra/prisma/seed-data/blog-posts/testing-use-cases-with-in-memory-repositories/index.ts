import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const testingUseCasesWithInMemoryRepositories: BlogPostSeed = {
  id: ID.blogPosts.testingUseCasesWithInMemoryRepositories,
  slug: 'testing-use-cases-with-in-memory-repositories',
  title: loc(
    'Testing Use Cases with In-Memory Repositories',
    'Testando use cases com repositórios em memória',
    'Probando use cases con repositorios en memoria',
  ),
  description: loc(
    'When a stub per method is enough, and when a small repository that keeps its data in memory makes page tests describe state instead of calls.',
    'Quando um stub por método basta, e quando um pequeno repositório que guarda os dados em memória faz os testes de página descreverem estado em vez de chamadas.',
    'Cuándo basta un stub por método, y cuándo un pequeño repositorio que guarda los datos en memoria hace que los tests de página describan estado en lugar de llamadas.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['testing', 'clean-architecture', 'typescript'],
  publishedAt: new Date('2026-10-14T00:00:00Z'),
  featured: false,
};
