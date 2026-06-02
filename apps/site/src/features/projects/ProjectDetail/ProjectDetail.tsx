'use client';

import { FC, useMemo } from 'react';

import { Icon } from '@repo/ui/Imagery';
import { TextRich } from '@repo/ui/View';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Link } from '~i18n/routing';

import {
  ProjectList,
  ProjectSummary,
} from '~features/home/ProjectsSection/ProjectList';
import { Breadcrumb } from '~features/shared/Breadcrumb';
import { SkillGroup } from '~features/shared/SkillGroup';

import { ProjectMetaGrid } from './ProjectMetaGrid';

export interface IProjectDetailProps {
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: { name: string; icon: string }[];
  summary?: string;
  objectives?: string;
  role?: string;
  period: { startAt: string; endAt?: string };
  content: string;
  relatedProjects: ProjectSummary[];
}

export const ProjectDetail: FC<IProjectDetailProps> = ({
  title,
  caption,
  coverImage,
  skills,
  summary,
  objectives,
  role,
  period,
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

  const metaLabels = useMemo(
    () => ({
      summary: t('summary_label'),
      objectives: t('objectives_label'),
      role: t('role_label'),
      period: t('period_label'),
    }),
    [t],
  );

  return (
    <article className="flex flex-col gap-y-10 pb-12">
      <div className="mx-4 xl:mx-auto xl:w-full xl:max-w-237.5 flex flex-col gap-y-10">
        <div className="flex items-center justify-between h-12">
          <Link
            href="/projects"
            className="flex items-center gap-x-2 text-base text-content-primary"
          >
            <Icon icon="material-symbols:arrow-back" className="text-2xl" />
            {t('back')}
          </Link>
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="relative w-full xl:h-[485px] h-60 rounded-lg overflow-hidden">
            <Image
              src={coverImage.url}
              fill
              alt={coverImage.alt}
              className="object-cover"
              priority
            />
          </div>

          <header className="flex flex-col gap-y-3">
            <h1 className="text-[40px] font-bold text-content-primary">
              {title}
            </h1>
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

        <ProjectMetaGrid
          summary={summary}
          objectives={objectives}
          role={role}
          period={period}
          labels={metaLabels}
        />

        {content && (
          <TextRich
            content={content}
            className="text-content-primary prose prose-invert max-w-none"
          />
        )}

        {relatedProjects.length > 0 && (
          <section className="flex flex-col gap-y-6">
            <h2 className="text-[32px] font-bold text-content-primary">
              {t('related_title')}
            </h2>
            <ProjectList projects={relatedProjects} view="grid" />
          </section>
        )}
      </div>
    </article>
  );
};
