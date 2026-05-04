/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

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

vi.mock('~assets/images/hero-landing-page.png', () => ({
  default: '/hero.png',
}));

vi.mock('~components', () => ({
  HeroBanner: ({ title, caption }: { title: string; caption: string }) => (
    <div data-testid="hero">
      <span data-testid="hero-title">{title}</span>
      <span data-testid="hero-caption">{caption}</span>
    </div>
  ),
  ProjectList: ({ projects }: { projects: unknown[] }) => (
    <ul data-testid="project-list">
      {(projects as { id: string; title: string }[]).map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  ),
  ContactForm: () => <div data-testid="contact-form" />,
  ContactInfo: () => <div data-testid="contact-info" />,
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

vi.mock('~components/View/ProjectList', () => ({}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PROFILE = {
  name: 'Alice Dev',
  headline: 'Software Engineer',
  bio: 'Bio text',
  photo: { url: 'https://example.com/photo.jpg', alt: 'Alice photo' },
};

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

function mockApis(profile: unknown | null, projects: unknown[] | null) {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes('/profile')) {
      if (profile === null)
        return Promise.resolve({
          ok: false,
          json: async () => ({
            data: null,
            error: { code: 'NOT_FOUND', message: '' },
          }),
        });
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: profile, error: null }),
      });
    }
    if (url.includes('/projects/featured')) {
      if (projects === null)
        return Promise.resolve({
          ok: false,
          json: async () => ({
            data: null,
            error: { code: 'INTERNAL_ERROR', message: '' },
          }),
        });
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: projects, error: null }),
      });
    }
    return Promise.resolve({ ok: false });
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Home page', () => {
  it('should render hero with profile data when profile fetch succeeds', async () => {
    mockApis(PROFILE, []);

    const { default: Home } = await import('~/app/[locale]/page');
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent('Alice Dev');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent(
      'Software Engineer',
    );
  });

  it('should render hero with i18n fallback when profile is not found', async () => {
    mockApis(null, []);

    const { default: Home } = await import('~/app/[locale]/page');
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent('t.hero_title');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent(
      't.hero_caption',
    );
  });

  it('should render project list with fetched projects', async () => {
    mockApis(PROFILE, PROJECTS);

    const { default: Home } = await import('~/app/[locale]/page');
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('should render empty project list when projects fetch fails', async () => {
    mockApis(PROFILE, null);

    const { default: Home } = await import('~/app/[locale]/page');
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('project-list')).toBeEmptyDOMElement();
  });

  it('should always render contact form and contact info', async () => {
    mockApis(null, []);

    const { default: Home } = await import('~/app/[locale]/page');
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
  });
});
