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
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        {t('projects_title')}
      </h4>
      <ProjectList projects={projects} className="pb-8 xl:pb-20" />
    </>
  );
}
