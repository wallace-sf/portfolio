/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
}));

vi.mock('~features/about/ValuesSection/ProfessionalValueCard', () => ({
  ProfessionalValueCard: ({ content }: { content: string }) => (
    <div data-testid="professional-value">{content}</div>
  ),
}));

const mockExecute = vi.fn();

vi.mock('@repo/application/portfolio', () => ({
  GetProfessionalValues: vi
    .fn()
    .mockImplementation(() => ({ execute: mockExecute })),
}));

vi.mock('~/lib/server/container', () => ({
  getServerContainer: vi.fn().mockReturnValue({
    professionalValueRepository: {},
  }),
}));

const PROFESSIONAL_VALUES = [
  { id: '1', icon: 'material-symbols:diamond', content: 'High quality delivery' },
  { id: '2', icon: 'material-symbols:code', content: 'Clean code' },
];

const right = (value: unknown) => ({ isRight: () => true, value });
const left = () => ({ isRight: () => false });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('about/ValuesSection', () => {
  it('should render section title from i18n', async () => {
    mockExecute.mockResolvedValue(right([]));

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection({ locale: 'en-US' }));

    expect(screen.getByText('t.values_title')).toBeInTheDocument();
  });

  it('should render professional values from use case response', async () => {
    mockExecute.mockResolvedValue(right(PROFESSIONAL_VALUES));

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection({ locale: 'en-US' }));

    expect(
      screen.getAllByTestId('professional-value').length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('High quality delivery')).toBeInTheDocument();
  });

  it('should render no values when use case returns empty', async () => {
    mockExecute.mockResolvedValue(right([]));

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection({ locale: 'en-US' }));

    expect(
      screen.queryByTestId('professional-value'),
    ).not.toBeInTheDocument();
  });

  it('should render no values when use case fails', async () => {
    mockExecute.mockResolvedValue(left());

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection({ locale: 'en-US' }));

    expect(
      screen.queryByTestId('professional-value'),
    ).not.toBeInTheDocument();
  });
});
