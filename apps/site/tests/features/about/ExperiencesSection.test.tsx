/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en-US'),
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

const mockExecute = vi.fn();

vi.mock('@repo/application/portfolio', () => ({
  GetExperiences: vi.fn().mockImplementation(() => ({ execute: mockExecute })),
}));

vi.mock('~/lib/server/container', () => ({
  getServerContainer: vi.fn().mockReturnValue({
    experienceRepository: {},
    skillRepository: {},
  }),
}));

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

const right = (value: unknown) => ({ isRight: () => true, value });
const left = () => ({ isRight: () => false });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('about/ExperiencesSection', () => {
  it('should render experience cards from use case response', async () => {
    mockExecute.mockResolvedValue(right(EXPERIENCES));

    const { ExperiencesSection } = await import(
      '~features/about/ExperiencesSection'
    );
    render(await ExperiencesSection());

    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Lead')).toBeInTheDocument();
  });

  it('should render no cards when use case returns empty', async () => {
    mockExecute.mockResolvedValue(right([]));

    const { ExperiencesSection } = await import(
      '~features/about/ExperiencesSection'
    );
    render(await ExperiencesSection());

    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });

  it('should render no cards when use case fails', async () => {
    mockExecute.mockResolvedValue(left());

    const { ExperiencesSection } = await import(
      '~features/about/ExperiencesSection'
    );
    render(await ExperiencesSection());

    expect(screen.queryByTestId('experience-card')).not.toBeInTheDocument();
  });
});
