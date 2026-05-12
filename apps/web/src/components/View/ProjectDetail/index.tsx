'use client';

import { FC, useMemo } from 'react';

import { TextRich } from '@repo/ui/View';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Breadcrumb } from '../Breadcrumb';
import { ProjectList, ProjectSummary } from '../ProjectList';
import { ProjectMetaGrid } from '../ProjectMetaGrid';
import { SkillGroup } from '../SkillGroup';

export interface IProjectDetailProps {
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: string[];
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
  theme,
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
    <article className="flex flex-col gap-y-8 pb-12">
      <div className="relative w-full h-[240px] xl:h-[400px] overflow-hidden">
        <Image
          src={coverImage.url}
          fill
          alt={coverImage.alt}
          className="object-cover"
          priority
        />
      </div>

      <div className="mx-4 xl:mx-auto xl:w-full xl:max-w-237.5 flex flex-col gap-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <header className="flex flex-col gap-y-2">
          <h1 className="!text-2xl xl:!text-4xl !font-bold !text-white">
            {title}
          </h1>
          {theme && (
            <span className="text-body-xs !text-dark-700 uppercase tracking-wide">
              {theme}
            </span>
          )}
          <p className="text-body-sm !text-dark-900">{caption}</p>
        </header>

        <SkillGroup
          skills={skills}
          max={skills.length}
          initializeWithMax={skills.length}
          total={skills.length}
        />

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
            className="!text-white prose prose-invert max-w-none"
          />
        )}

        {relatedProjects.length > 0 && (
          <section className="flex flex-col gap-y-6">
            <h2 className="!text-xl !font-bold !text-white">
              {t('related_title')}
            </h2>
            <ProjectList projects={relatedProjects} view="row" compact />
          </section>
        )}
      </div>
    </article>
  );
};
