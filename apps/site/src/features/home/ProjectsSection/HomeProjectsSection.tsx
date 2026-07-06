import { type Locale } from '@repo/core/shared';
import { getTranslations } from 'next-intl/server';

import { Link } from '~/i18n/routing';

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
      <h2 className="text-heading-h4 my-6 lg:mx-auto lg:my-8 lg:block lg:w-full lg:max-w-237.5">
        {t('projects_title')}
      </h2>
      <ProjectList projects={projects} compact className="pb-6" />
      <div className="flex justify-center pb-8 lg:pb-20">
        <Link
          href="/projects"
          className="text-sm text-content-disabled underline"
        >
          {t('view_all_projects')}
        </Link>
      </div>
    </>
  );
}
