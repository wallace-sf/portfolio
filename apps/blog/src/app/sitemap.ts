import { ListBlogPosts } from '@repo/application/blog';
import { LOCALES } from '@repo/core/shared';
import type { MetadataRoute } from 'next';

import { env } from '~/config/env';
import { DEFAULT_LOCALE } from '~/i18n/routing';
import { getServerContainer } from '~/lib/server/container';

export const dynamic = 'force-static';

const BUILD_DATE = new Date().toISOString();

/**
 * A single sitemap covers every locale — Next.js's generateSitemaps()
 * multi-file split is meant for tens of thousands of URLs, well beyond what
 * a blog needs, so this mirrors apps/site's single sitemap.ts instead.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const indexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${env.siteUrl}/blog/${locale}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  try {
    const result = await new ListBlogPosts(
      getServerContainer().blogPostRepository,
    ).execute({ locale: DEFAULT_LOCALE });

    const posts = result.isRight() ? result.value : [];

    const postEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
      posts.map((post) => ({
        url: `${env.siteUrl}/blog/${locale}/${post.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );

    return [...indexEntries, ...postEntries];
  } catch {
    return indexEntries;
  }
}
