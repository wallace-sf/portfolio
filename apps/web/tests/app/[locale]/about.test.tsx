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
  ExperienceCard: ({
    company,
    position,
  }: {
    company: string;
    position: string;
  }) => (
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

const PROFESSIONAL_VALUES = [
  {
    id: '1',
    icon: 'material-symbols:diamond',
    content: 'High quality delivery',
  },
];

function okResponse(data: unknown[]) {
  return Promise.resolve({
    ok: true,
    json: async () => ({ data, error: null }),
  });
}

function errorResponse() {
  return Promise.resolve({
    ok: false,
    json: async () => ({
      data: null,
      error: { code: 'INTERNAL_ERROR', message: '' },
    }),
  });
}

function mockApis({
  experiences = [] as unknown[] | null,
  professionalValues = [] as unknown[] | null,
  fail = false,
} = {}) {
  if (fail) {
    mockFetch.mockRejectedValue(new Error('Network error'));
    return;
  }
  mockFetch.mockImplementation((url: string) => {
    if (url.includes('/api/v1/professional-values'))
      return professionalValues === null
        ? errorResponse()
        : okResponse(professionalValues);
    if (url.includes('/api/v1/experiences'))
      return experiences === null ? errorResponse() : okResponse(experiences);
    return errorResponse();
  });
}

describe('About page', () => {
  it('should render values title from i18n', async () => {
    mockApis();
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText('t.values_title')).toBeInTheDocument();
  });

  it('should render professional values from API response', async () => {
    mockApis({ professionalValues: PROFESSIONAL_VALUES });
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.getAllByTestId('professional-value').length).toBeGreaterThan(
      0,
    );
  });

  it('should render no professional values when API returns empty', async () => {
    mockApis({ professionalValues: [] });
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.queryByTestId('professional-value')).not.toBeInTheDocument();
  });

  it('should render experience cards from API response', async () => {
    mockApis({ experiences: EXPERIENCES });
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Lead')).toBeInTheDocument();
  });

  it('should render no experience cards when API fails', async () => {
    mockApis({ experiences: null });
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });

  it('should render no experience cards when fetch throws', async () => {
    mockApis({ fail: true });
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));
    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });
});
