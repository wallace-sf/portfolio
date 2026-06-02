'use client';

import { FC, useMemo } from 'react';

import classNames from 'classnames';

import { ProjectCard, IProjectCardProps } from './ProjectCard';

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  theme?: string;
  skills: { name: string; icon: string }[];
}

interface IProjectListProps {
  projects: ProjectSummary[];
  compact?: IProjectCardProps['compact'];
  view: IProjectCardProps['view'];
  className?: string;
}

export const ProjectList: FC<IProjectListProps> = ({
  projects,
  compact,
  view,
  className,
}) => {
  const renderedProjects = useMemo(() => {
    return projects.map((project) => (
      <li key={project.id}>
        <ProjectCard
          slug={project.slug}
          title={project.title}
          caption={project.caption}
          coverImage={project.coverImage}
          theme={project.theme}
          skills={project.skills}
          compact={compact}
          view={view}
        />
      </li>
    ));
  }, [projects, compact, view]);

  return (
    <ul
      className={classNames(
        'mx-auto grid max-w-237.5',
        {
          'grid-cols-1 gap-6': view === 'row',
          'gap-4 md:grid-cols-2 xl:gap-6': view === 'grid',
        },
        className,
      )}
    >
      {renderedProjects}
    </ul>
  );
};
