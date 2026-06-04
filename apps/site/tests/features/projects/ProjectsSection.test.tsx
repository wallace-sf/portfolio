/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('~features/home/ProjectsSection', () => ({
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
}));

const PROJECTS = [
  {
    id: '1',
    slug: 'proj-a',
    title: 'Project A',
    caption: 'Cap A',
    coverImage: { url: '', alt: '' },
    skills: [],
  },
  {
    id: '2',
    slug: 'proj-b',
    title: 'Project B',
    caption: 'Cap B',
    coverImage: { url: '', alt: '' },
    skills: [],
  },
];

describe('projects/ProjectsSection', () => {
  it('should render projects from props', async () => {
    const { ProjectsSection } = await import('~features/projects/ProjectsSection');
    render(<ProjectsSection projects={PROJECTS} />);

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('should render empty list when no projects provided', async () => {
    const { ProjectsSection } = await import('~features/projects/ProjectsSection');
    render(<ProjectsSection projects={[]} />);

    expect(screen.getByTestId('project-list')).toBeEmptyDOMElement();
  });
});
