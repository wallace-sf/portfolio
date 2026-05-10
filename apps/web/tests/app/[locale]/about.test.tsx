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

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

vi.mock('~components/View', () => ({
  ProfessionalValue: ({ content }: { content: string }) => (
    <div data-testid="professional-value">{content}</div>
  ),
  ExperienceCard: ({ company, position }: { company: string; position: string }) => (
    <div data-testid="experience-card">
      <span>{position}</span>
      <span>{company}</span>
    </div>
  ),
  IExperienceCardProps: undefined,
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

const EXPERIENCES = [
  {
    id: '1',
    company: 'Acme Corp',
    position: 'Senior Developer',
    location: 'São Paulo, Brazil',
    employmentType: 'FULL_TIME',
    locationType: 'REMOTE',
    startAt: '2023-01-01T00:00:00.000Z',
    skills: [],
  },
  {
    id: '2',
    company: 'Beta Inc',
    position: 'Tech Lead',
    location: 'Remote',
    employmentType: 'FULL_TIME',
    locationType: 'REMOTE',
    startAt: '2024-01-01T00:00:00.000Z',
    skills: [],
  },
];

function mockApi(experiences: unknown[] | null) {
  mockFetch.mockResolvedValue(
    experiences === null
      ? { ok: false, json: async () => ({ data: null, error: { code: 'INTERNAL_ERROR', message: '' } }) }
      : { ok: true, json: async () => ({ data: experiences, error: null }) },
  );
}

describe('About page', () => {
  it('should render values title from i18n', async () => {
    mockApi([]);
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText('t.values_title')).toBeInTheDocument();
  });

  it('should render professional values', async () => {
    mockApi([]);
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.getAllByTestId('professional-value').length).toBeGreaterThan(0);
  });

  it('should render experience cards from API response', async () => {
    mockApi(EXPERIENCES);
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Lead')).toBeInTheDocument();
  });

  it('should render no experience cards when API fails', async () => {
    mockApi(null);
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });

  it('should render no experience cards when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });
});
