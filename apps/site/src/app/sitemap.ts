import { GetPublishedProjects } from '@repo/application/portfolio';
import { LOCALES } from '@repo/core/shared';
import type { MetadataRoute } from 'next';

import { env } from '~/config/env';
import { DEFAULT_LOCALE } from '~/i18n/routing';
import { getServerContainer } from '~/lib/server/container';

export const dynamic = 'force-static';

const BUILD_DATE = new Date().toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/about', '/projects'];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${env.siteUrl}/${locale}${route}`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
  );

  try {
    const { projectRepository, skillRepository } = getServerContainer();
    const result = await new GetPublishedProjects(
      projectRepository,
      skillRepository,
    ).execute({ locale: DEFAULT_LOCALE });

    const projects = result.isRight() ? result.value : [];

    const projectEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
      projects.map((project) => ({
        url: `${env.siteUrl}/${locale}/projects/${project.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );

    return [...staticEntries, ...projectEntries];
  } catch {
    return staticEntries;
  }
}
