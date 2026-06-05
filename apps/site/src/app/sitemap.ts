import { GetPublishedProjects } from '@repo/application/portfolio';
import { LOCALES } from '@repo/core/shared';
import type { MetadataRoute } from 'next';

import { getServerContainer } from '~/lib/server/container';

export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const BUILD_DATE = new Date().toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/about', '/projects'];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
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
    ).execute({ locale: 'en-US' });

    const projects = result.isRight() ? result.value : [];

    const projectEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
      projects.map((project) => ({
        url: `${SITE_URL}/${locale}/projects/${project.slug}`,
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
