import { getLocale, getTranslations } from 'next-intl/server';

import { HeroSection } from '~features/projects/HeroSection';
import { ProjectList, ProjectSummary } from '~features/home/ProjectsSection';
import { applyDevSimulations } from '~/dev/simulate';
import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

interface ProjectsPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function Projects({ searchParams }: ProjectsPageProps) {
  await applyDevSimulations(await searchParams);

  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('Projects'),
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const projectsRes = await fetch(
    `${baseUrl}/api/v1/projects?locale=${locale}`,
    { cache: 'no-store' },
  ).catch(() => null);

  let projects: ProjectSummary[] = [];
  if (projectsRes?.ok) {
    const body: ApiResponse<ProjectSummary[]> = await projectsRes.json();
    if (!body.error) projects = body.data;
  }

  return (
    <>
      <HeroSection
        title={t('hero_title')}
        caption={t('hero_caption')}
        content={t('hero_content')}
        alt={t('hero_image_alt')}
      />
      <ProjectList projects={projects} view="grid" className="py-8 xl:py-20" />
    </>
  );
}
