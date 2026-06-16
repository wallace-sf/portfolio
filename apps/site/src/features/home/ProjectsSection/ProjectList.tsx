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
  className?: string;
}

export const ProjectList: FC<IProjectListProps> = ({
  projects,
  compact,
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
        />
      </li>
    ));
  }, [projects, compact]);

  return (
    <ul
      className={classNames(
        'grid grid-cols-1 gap-4 lg:gap-6 mx-4 lg:mx-auto max-w-237.5',
        compact && 'lg:grid-cols-2',
        className,
      )}
    >
      {renderedProjects}
    </ul>
  );
};
