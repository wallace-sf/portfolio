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
        'grid gap-4 md:grid-cols-2 xl:grid-cols-1 xl:gap-6 mx-4 xl:mx-auto max-w-237.5',
        className,
      )}
    >
      {renderedProjects}
    </ul>
  );
};
