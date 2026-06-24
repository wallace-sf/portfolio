/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
}));

vi.mock('~/i18n/routing', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('~features/home/ProjectsSection/ProjectList', () => ({
  ProjectList: ({
    projects,
  }: {
    projects: { id: string; title: string }[];
  }) => (
    <ul data-testid="project-list">
      {projects.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  ),
  ProjectSummary: undefined,
}));

vi.mock('~features/home/ProjectsSection/ProjectCard', () => ({
  ProjectCard: () => null,
}));

const PROJECTS = [
  {
    id: '1',
    slug: 'proj-a',
    title: 'Project A',
    caption: 'Cap A',
    thumbnailImage: { url: '', alt: '' },
    skills: [],
  },
  {
    id: '2',
    slug: 'proj-b',
    title: 'Project B',
    caption: 'Cap B',
    thumbnailImage: { url: '', alt: '' },
    skills: [],
  },
];

describe('home/ProjectsSection', () => {
  it('should render section title and projects from props', async () => {
    const { ProjectsSection } = await import('~features/home/ProjectsSection');
    render(await ProjectsSection({ locale: 'en-US', projects: PROJECTS }));

    expect(screen.getByText('t.projects_title')).toBeInTheDocument();
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('should render empty list when no projects provided', async () => {
    const { ProjectsSection } = await import('~features/home/ProjectsSection');
    render(await ProjectsSection({ locale: 'en-US', projects: [] }));

    expect(screen.getByTestId('project-list')).toBeEmptyDOMElement();
  });

  it('should render section title even with no projects', async () => {
    const { ProjectsSection } = await import('~features/home/ProjectsSection');
    render(await ProjectsSection({ locale: 'en-US', projects: [] }));

    expect(screen.getByText('t.projects_title')).toBeInTheDocument();
  });

  it('should render a "view all projects" link pointing to /projects', async () => {
    const { ProjectsSection } = await import('~features/home/ProjectsSection');
    render(await ProjectsSection({ locale: 'en-US', projects: PROJECTS }));

    const link = screen.getByRole('link', { name: 't.view_all_projects' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/projects');
  });
});
