/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('@repo/core/shared', () => ({
  DEFAULT_LOCALE: 'en-US',
  LOCALES: ['en-US', 'pt-BR', 'es'],
}));

vi.mock('~features/about/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('~features/about/ValuesSection', () => ({
  ValuesSection: () => <div data-testid="values-section" />,
}));

vi.mock('~features/about/ExperiencesSection', () => ({
  ExperiencesSection: () => <div data-testid="experiences-section" />,
}));

vi.mock('~features/about/CurriculumCTA', () => ({
  CurriculumCTA: () => <div data-testid="curriculum-cta" />,
}));

vi.mock('~/lib/server/container', () => ({
  getServerContainer: vi.fn().mockReturnValue({ profileRepository: {} }),
}));

vi.mock('@repo/application/portfolio', () => ({
  GetProfile: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({ isLeft: () => true }),
  })),
}));

describe('About page', () => {
  it('should render all feature sections', async () => {
    const { default: About } = await import('~/app/[locale]/about/page');
    render(
      await About({ params: Promise.resolve({ locale: 'en-US' }) }),
    );

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('values-section')).toBeInTheDocument();
    expect(screen.getByTestId('experiences-section')).toBeInTheDocument();
    expect(screen.getByTestId('curriculum-cta')).toBeInTheDocument();
  });
});
