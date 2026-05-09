'use client';

import { FC, useMemo } from 'react';

import classNames from 'classnames';

import { ProjectCard, IProjectCardProps } from '../ProjectCard';

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  caption: string;
  coverImage: { url: string; alt: string };
  skills: string[];
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
          skills={project.skills}
          caption={project.caption}
          title={project.title}
          compact={compact}
          view={view}
        />
      </li>
    ));
  }, [projects, compact, view]);

  return (
    <ul
      className={classNames(
        'mx-auto grid max-w-237.5 gap-4',
        {
          'grid-cols-1': view === 'row',
          'md:grid-cols-2 xl:gap-6': view === 'grid',
        },
        className,
      )}
    >
      {renderedProjects}
    </ul>
  );
};
