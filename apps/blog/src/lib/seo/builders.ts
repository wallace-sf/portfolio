import { createSeoBuilders } from '@repo/seo';

import { env } from '~/config/env';

export const { buildAlternates, buildOpenGraph } = createSeoBuilders({
  siteUrl: env.siteUrl,
  basePath: '/blog',
  siteName: 'Wallace Ferreira — Blog',
  rssFeed: { filename: 'rss.xml', title: 'Wallace Ferreira — Blog' },
});
