/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('~/dev/simulate', () => ({
  applyDevSimulations: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('~features/projects/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('~features/projects/ProjectsSection', () => ({
  ProjectsSection: () => <div data-testid="projects-section" />,
}));

describe('Projects page', () => {
  it('should render all feature sections', async () => {
    const { default: Projects } = await import(
      '~/app/[locale]/projects/page'
    );
    render(await Projects({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('projects-section')).toBeInTheDocument();
  });
});
