/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('~/dev/simulate', () => ({
  applyDevSimulations: vi.fn().mockResolvedValue(undefined),
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

describe('About page', () => {
  it('should render all feature sections', async () => {
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('values-section')).toBeInTheDocument();
    expect(screen.getByTestId('experiences-section')).toBeInTheDocument();
  });
});
