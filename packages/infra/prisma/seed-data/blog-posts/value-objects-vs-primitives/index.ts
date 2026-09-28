import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const valueObjectsVsPrimitives: BlogPostSeed = {
  id: ID.blogPosts.valueObjectsVsPrimitives,
  slug: 'value-objects-vs-primitives',
  title: loc(
    'Value Objects vs Primitives: Where to Draw the Line',
    'Value Objects vs primitivos: onde traçar a linha',
    'Value Objects vs primitivos: dónde trazar la línea',
  ),
  description: loc(
    'Not every field deserves its own class. A concrete rule for deciding when a value is rich enough to become a Value Object and when a validated primitive is the honest choice.',
    'Nem todo campo merece a própria classe. Uma regra concreta para decidir quando um valor é rico o bastante para virar um Value Object e quando um primitivo validado é a escolha honesta.',
    'No todo campo merece su propia clase. Una regla concreta para decidir cuándo un valor es lo bastante rico para convertirse en un Value Object y cuándo un primitivo validado es la opción honesta.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['ddd', 'value-objects', 'typescript'],
  publishedAt: new Date('2026-08-08T00:00:00Z'),
  featured: true,
};
