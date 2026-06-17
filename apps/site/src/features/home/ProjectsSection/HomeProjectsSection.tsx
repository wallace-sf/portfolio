import { type Locale } from '@repo/core/shared';
import { getTranslations } from 'next-intl/server';

import { ProjectList, ProjectSummary } from './ProjectList';

interface ProjectsSectionProps {
  locale: Locale;
  projects: ProjectSummary[];
}

export async function ProjectsSection({
  locale,
  projects,
}: ProjectsSectionProps) {
  const t = await getTranslations({ locale, namespace: 'Home' });

  return (
    <>
      <h2 className="text-white my-6 !text-xl lg:block lg:mx-auto lg:my-8 lg:w-full lg:!text-[32px] lg:max-w-237.5">
        {t('projects_title')}
      </h2>
      <ProjectList projects={projects} compact className="pb-8 lg:pb-20" />
    </>
  );
}
