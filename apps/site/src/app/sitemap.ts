import type { MetadataRoute } from 'next';

import { ApiResponse } from '~/lib/api/envelope';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const LOCALES = ['en-US', 'pt-BR', 'es'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/about', '/projects'];

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
  );

  try {
    const res = await fetch(`${SITE_URL}/api/v1/projects`, {
      cache: 'no-store',
    });
    if (!res.ok) return staticEntries;

    const body: ApiResponse<{ slug: string }[]> = await res.json();
    if (body.error) return staticEntries;

    const projectEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
      body.data.map((project) => ({
        url: `${SITE_URL}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    );

    return [...staticEntries, ...projectEntries];
  } catch {
    return staticEntries;
  }
}
