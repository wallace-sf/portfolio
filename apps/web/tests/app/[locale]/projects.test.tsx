/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({ get: () => 'localhost:3000' }),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
  getLocale: vi.fn().mockResolvedValue('en-US'),
}));

vi.mock('~/dev/simulate', () => ({
  applyDevSimulations: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('~/lib/api/internal', () => ({
  getInternalBaseUrl: vi.fn().mockResolvedValue('http://localhost:3000'),
}));

vi.mock('~assets/images/hero-projects.png', () => ({
  default: '/hero-projects.png',
}));

vi.mock('~components/View', () => ({
  HeroBanner: ({ title, caption }: { title: string; caption: string }) => (
    <div data-testid="hero">
      <span data-testid="hero-title">{title}</span>
      <span data-testid="hero-caption">{caption}</span>
    </div>
  ),
  ProjectList: ({ projects }: { projects: { id: string; title: string }[] }) => (
    <ul data-testid="project-list">
      {projects.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  ),
}));

vi.mock('~components/View/ProjectList', () => ({}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

const PROJECTS = [
  { id: '1', slug: 'proj-a', title: 'Project A', caption: 'Cap A', coverImage: { url: '', alt: '' }, skills: [] },
  { id: '2', slug: 'proj-b', title: 'Project B', caption: 'Cap B', coverImage: { url: '', alt: '' }, skills: [] },
];

function mockApi(projects: unknown[] | null) {
  mockFetch.mockResolvedValue(
    projects === null
      ? { ok: false, json: async () => ({ data: null, error: { code: 'INTERNAL_ERROR', message: '' } }) }
      : { ok: true, json: async () => ({ data: projects, error: null }) },
  );
}

describe('Projects page', () => {
  it('should render hero with i18n translations', async () => {
    mockApi([]);

    const { default: Projects } = await import('~/app/[locale]/projects/page');
    render(await Projects({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent('t.hero_title');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent('t.hero_caption');
  });

  it('should render project list with fetched projects', async () => {
    mockApi(PROJECTS);

    const { default: Projects } = await import('~/app/[locale]/projects/page');
    render(await Projects({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('should render empty project list when API fails', async () => {
    mockApi(null);

    const { default: Projects } = await import('~/app/[locale]/projects/page');
    render(await Projects({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('project-list')).toBeEmptyDOMElement();
  });

  it('should render empty project list when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { default: Projects } = await import('~/app/[locale]/projects/page');
    render(await Projects({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('project-list')).toBeEmptyDOMElement();
  });
});
