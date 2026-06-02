/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en-US'),
}));

vi.mock('~/lib/api/internal', () => ({
  getInternalBaseUrl: vi.fn().mockResolvedValue('http://localhost:3000'),
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

vi.mock('~features/about/ExperiencesSection/ExperienceCard', () => ({
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
    location: 'São Paulo',
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

describe('about/ExperiencesSection', () => {
  it('should render experience cards from API response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: EXPERIENCES, error: null }),
    });

    const { ExperiencesSection } = await import(
      '~features/about/ExperiencesSection'
    );
    render(await ExperiencesSection());

    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Lead')).toBeInTheDocument();
  });

  it('should render no cards when API returns empty', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], error: null }),
    });

    const { ExperiencesSection } = await import(
      '~features/about/ExperiencesSection'
    );
    render(await ExperiencesSection());

    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });

  it('should render no cards when fetch fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: '' },
      }),
    });

    const { ExperiencesSection } = await import(
      '~features/about/ExperiencesSection'
    );
    render(await ExperiencesSection());

    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });

  it('should render no cards when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { ExperiencesSection } = await import(
      '~features/about/ExperiencesSection'
    );
    render(await ExperiencesSection());

    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });
});
