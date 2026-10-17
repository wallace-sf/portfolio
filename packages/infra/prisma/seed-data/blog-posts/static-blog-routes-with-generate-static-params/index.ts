import { ID, loc } from '../../../seeders';
import { content as enUS } from './en-US';
import { content as ptBR } from './pt-BR';
import { content as es } from './es';

import type { BlogPostSeed } from '../types';

export const staticBlogRoutesWithGenerateStaticParams: BlogPostSeed = {
  id: ID.blogPosts.staticBlogRoutesWithGenerateStaticParams,
  slug: 'static-blog-routes-with-generate-static-params',
  title: loc(
    'Static Blog Routes with generateStaticParams',
    'Rotas estáticas de blog com generateStaticParams',
    'Rutas estáticas de blog con generateStaticParams',
  ),
  description: loc(
    'How dated post URLs are prerendered from one use case, why every other URL is a 404, and how the sitemap and canonical URLs stay in sync.',
    'Como as URLs datadas dos posts são pré-renderizadas a partir de um use case, por que toda outra URL é 404, e como o sitemap e as URLs canônicas ficam em sincronia.',
    'Cómo se prerenderizan las URLs con fecha de los posts a partir de un use case, por qué cualquier otra URL es 404, y cómo el sitemap y las URLs canónicas se mantienen sincronizados.',
  ),
  content: loc(enUS, ptBR, es),
  tags: ['nextjs', 'seo', 'react-server-components'],
  publishedAt: new Date('2026-10-15T00:00:00Z'),
  featured: false,
};
