import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const serverComponentsAsCompositionRoot: BlogPostSeed = {
  id: ID.blogPosts.serverComponentsAsCompositionRoot,
  slug: 'server-components-as-composition-root',
  title: loc(
    'Server Components Are the Composition Root',
    'Server Components são o composition root',
    'Los Server Components son el composition root',
  ),
  description: loc(
    'Why this site calls use cases directly from Server Components at build time, passes plain data down as props, and never fetches from a useEffect.',
    'Por que este site chama use cases direto dos Server Components em tempo de build, passa dados puros para baixo como props, e nunca busca dados de um useEffect.',
    'Por qué este sitio llama a los use cases directamente desde los Server Components en tiempo de build, pasa datos planos hacia abajo como props, y nunca hace fetch desde un useEffect.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['react-server-components', 'clean-architecture', 'nextjs'],
  publishedAt: new Date('2026-08-22T00:00:00Z'),
  featured: false,
};
