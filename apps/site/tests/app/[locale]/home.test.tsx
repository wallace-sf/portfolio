/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('~/dev/simulate', () => ({
  applyDevSimulations: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('~features/home/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('~features/home/ProjectsSection', () => ({
  ProjectsSection: () => <div data-testid="projects-section" />,
  ProjectsSkeleton: () => null,
}));

vi.mock('~features/shared/HeroBanner/HeroBannerSkeleton', () => ({
  HeroBannerSkeleton: () => null,
}));

describe('Home page', () => {
  it('should render all feature sections', async () => {
    const { default: Home } = await import('~/app/[locale]/page');
    render(await Home({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('projects-section')).toBeInTheDocument();
  });
});
