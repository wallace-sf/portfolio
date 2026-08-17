import { createSeoBuilders } from '@repo/seo';

import { env } from '~/config/env';

export const { buildAlternates, buildOpenGraph } = createSeoBuilders({
  siteUrl: env.siteUrl,
  siteName: 'Wallace Ferreira',
  rssFeed: { filename: 'feed.xml', title: 'Wallace Ferreira' },
});
