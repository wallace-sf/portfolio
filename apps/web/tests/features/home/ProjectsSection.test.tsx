/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
  getLocale: vi.fn().mockResolvedValue('en-US'),
}));

vi.mock('~/lib/api/internal', () => ({
  getInternalBaseUrl: vi.fn().mockResolvedValue('http://localhost:3000'),
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

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

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

describe('home/ProjectsSection', () => {
  it('should render section title and projects from API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: PROJECTS, error: null }),
    });

    const { ProjectsSection } = await import(
      '~features/home/ProjectsSection'
    );
    render(await ProjectsSection());

    expect(screen.getByText('t.projects_title')).toBeInTheDocument();
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('should render empty list when fetch fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: '' },
      }),
    });

    const { ProjectsSection } = await import(
      '~features/home/ProjectsSection'
    );
    render(await ProjectsSection());

    expect(screen.getByTestId('project-list')).toBeEmptyDOMElement();
  });

  it('should render empty list when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { ProjectsSection } = await import(
      '~features/home/ProjectsSection'
    );
    render(await ProjectsSection());

    expect(screen.getByTestId('project-list')).toBeEmptyDOMElement();
  });
});
