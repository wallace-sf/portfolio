import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const enforcingDependencyRuleInMonorepo: BlogPostSeed = {
  id: ID.blogPosts.enforcingDependencyRuleInMonorepo,
  slug: 'enforcing-dependency-rule-in-monorepo',
  title: loc(
    'Enforcing the Dependency Rule in a Monorepo',
    'Garantindo a regra de dependência num monorepo',
    'Haciendo cumplir la regla de dependencia en un monorepo',
  ),
  description: loc(
    'The package manifests and lint rules that keep core, application and infra pointing inward, and the two places where the rule is still only a convention.',
    'Os manifestos de pacote e as regras de lint que mantêm core, application e infra apontando para dentro, e os dois pontos onde a regra ainda é só uma convenção.',
    'Los manifiestos de paquete y las reglas de lint que mantienen core, application e infra apuntando hacia dentro, y los dos puntos donde la regla sigue siendo solo una convención.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['architecture', 'clean-architecture', 'monorepo'],
  publishedAt: new Date('2026-10-17T00:00:00Z'),
  featured: true,
};
