'use client';

import { FC, useMemo } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { Divider, TextRich } from '@repo/ui/View';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import {
  ProjectList,
  ProjectSummary,
} from '~features/home/ProjectsSection/ProjectList';
import { Breadcrumb } from '~features/shared/Breadcrumb';
import { OpenSourceBadge } from '~features/shared/OpenSourceBadge';
import { SkillGroup } from '~features/shared/SkillGroup';
import { Link } from '~i18n/routing';

import styles from './ProjectDetail.module.css';

export interface IProjectDetailProps {
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: { name: string; icon: string }[];
  role?: string;
  period: { startAt: string; endAt?: string };
  repositoryUrl?: string;
  content: string;
  relatedProjects: ProjectSummary[];
}

export const ProjectDetail: FC<IProjectDetailProps> = ({
  title,
  caption,
  coverImage,
  skills,
  role,
  repositoryUrl,
  content,
  relatedProjects,
}) => {
  const t = useTranslations('ProjectDetail');

  const breadcrumbItems = useMemo(
    () => [
      { label: t('breadcrumb_home'), href: '/' as const },
      { label: t('breadcrumb_projects'), href: '/projects' as const },
      { label: title },
    ],
    [t, title],
  );

  return (
    <article className="mt-6 flex flex-col gap-y-10 pb-12 lg:mt-0">
      <div className="flex flex-col gap-y-10 lg:mx-auto lg:w-full lg:max-w-237.5">
        <div className="flex flex-col items-start justify-center gap-y-1 lg:flex-row lg:items-center lg:justify-between">
          <Breadcrumb
            items={breadcrumbItems}
            className="flex min-h-12 items-center lg:order-2"
          />
          <Link
            href="/projects"
            className="flex items-center gap-x-2 text-base text-content-primary lg:order-1 lg:min-h-12"
          >
            <Icon icon="material-symbols:arrow-back" className="text-2xl" />
            {t('back')}
          </Link>
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="relative h-60 w-full overflow-hidden rounded-lg shadow-drop-sm lg:h-[485px]">
            <Image
              src={coverImage.url}
              fill
              alt={coverImage.alt}
              className="object-cover"
              priority
            />
          </div>

          <header className="flex flex-col gap-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-[40px] font-bold text-content-primary">
                {title}
              </h1>
              {repositoryUrl && (
                <OpenSourceBadge repositoryUrl={repositoryUrl} />
              )}
            </div>
            <p className="text-xl text-content-primary">{caption}</p>
          </header>

          {skills.length > 0 && (
            <SkillGroup
              skills={skills}
              max={skills.length}
              initializeWithMax={skills.length}
              total={skills.length}
            />
          )}
        </div>

        {role && (
          <dl className="flex flex-row flex-wrap gap-x-10 gap-y-4">
            <div className="flex flex-col gap-y-1">
              <dt className="text-base font-bold text-content-primary">
                {t('role_label')}
              </dt>
              <dd className="text-base text-content-primary">{role}</dd>
            </div>
          </dl>
        )}

        <Divider />

        {content && <TextRich content={content} className={styles.editorial} />}

        {relatedProjects.length > 0 && (
          <section className="flex flex-col gap-y-6">
            <h2 className="text-[32px] font-bold text-content-primary">
              {t('related_title')}
            </h2>
            <ProjectList projects={relatedProjects} />
          </section>
        )}
      </div>
    </article>
  );
};
