import { getLocale, getTranslations } from 'next-intl/server';

import HeroProjects from '~assets/images/hero-projects.png';
import { HeroBanner, ProjectList } from '~components/View';
import { applyDevSimulations } from '~/dev/simulate';
import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

import { ProjectSummary } from '~components/View/ProjectList';

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
      <HeroBanner
        src={HeroProjects}
        title={t('hero_title')}
        caption={t('hero_caption')}
        content={t('hero_content')}
        alt={t('hero_image_alt')}
        imageClassName="object-contain p-6 xl:py-8"
      />
      <ProjectList projects={projects} view="grid" className="py-8 xl:py-20" />
    </>
  );
}
