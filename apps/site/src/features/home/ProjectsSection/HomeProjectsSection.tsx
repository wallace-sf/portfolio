import { getLocale, getTranslations } from 'next-intl/server';

import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

import { ProjectList, ProjectSummary } from './ProjectList';

export async function ProjectsSection() {
  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('Home'),
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const projectsRes = await fetch(
    `${baseUrl}/api/v1/projects/featured?locale=${locale}`,
    { cache: 'no-store' },
  ).catch(() => null);

  let projects: ProjectSummary[] = [];
  if (projectsRes?.ok) {
    const body: ApiResponse<ProjectSummary[]> = await projectsRes.json();
    if (!body.error) projects = body.data;
  }

  return (
    <>
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        {t('projects_title')}
      </h4>
      <ProjectList projects={projects} view="grid" className="pb-8 xl:pb-20" />
    </>
  );
}
