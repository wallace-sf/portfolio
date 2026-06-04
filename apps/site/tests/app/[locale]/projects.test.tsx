/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('@repo/core/shared', () => ({
  LOCALES: ['en-US', 'pt-BR', 'es'],
}));

vi.mock('~/lib/server/container', () => ({
  getServerContainer: vi.fn().mockReturnValue({
    projectRepository: {},
    skillRepository: {},
  }),
}));

vi.mock('@repo/application/portfolio', () => ({
  GetPublishedProjects: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({ isRight: () => false }),
  })),
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
    render(
      await Projects({ params: Promise.resolve({ locale: 'en-US' }) }),
    );

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('projects-section')).toBeInTheDocument();
  });
});
