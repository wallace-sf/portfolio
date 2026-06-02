import { getLocale } from 'next-intl/server';

import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';
import { ProjectList, ProjectSummary } from '~features/home/ProjectsSection';

export async function ProjectsSection() {
  const [locale, baseUrl] = await Promise.all([
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const res = await fetch(`${baseUrl}/api/v1/projects?locale=${locale}`, {
    cache: 'no-store',
  }).catch(() => null);

  let projects: ProjectSummary[] = [];
  if (res?.ok) {
    const body: ApiResponse<ProjectSummary[]> = await res.json();
    if (!body.error) projects = body.data;
  }

  return (
    <ProjectList projects={projects} view="row" className="py-8 xl:py-20" />
  );
}
