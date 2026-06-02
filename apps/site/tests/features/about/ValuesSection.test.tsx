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

vi.mock('~features/about/ValuesSection/ProfessionalValueCard', () => ({
  ProfessionalValueCard: ({ content }: { content: string }) => (
    <div data-testid="professional-value">{content}</div>
  ),
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

const PROFESSIONAL_VALUES = [
  { id: '1', icon: 'material-symbols:diamond', content: 'High quality delivery' },
  { id: '2', icon: 'material-symbols:code', content: 'Clean code' },
];

describe('about/ValuesSection', () => {
  it('should render section title from i18n', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], error: null }),
    });

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection());

    expect(screen.getByText('t.values_title')).toBeInTheDocument();
  });

  it('should render professional values from API response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: PROFESSIONAL_VALUES, error: null }),
    });

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection());

    expect(
      screen.getAllByTestId('professional-value').length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('High quality delivery')).toBeInTheDocument();
  });

  it('should render no values when API returns empty', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], error: null }),
    });

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection());

    expect(
      screen.queryByTestId('professional-value'),
    ).not.toBeInTheDocument();
  });

  it('should render no values when fetch fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: '' },
      }),
    });

    const { ValuesSection } = await import('~features/about/ValuesSection');
    render(await ValuesSection());

    expect(
      screen.queryByTestId('professional-value'),
    ).not.toBeInTheDocument();
  });
});
