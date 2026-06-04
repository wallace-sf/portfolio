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
    profileRepository: {},
    projectRepository: {},
    skillRepository: {},
  }),
}));

vi.mock('@repo/application/portfolio', () => ({
  GetProfile: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({ isLeft: () => true, isRight: () => false }),
  })),
  GetFeaturedProjects: vi.fn().mockImplementation(() => ({
    execute: vi.fn().mockResolvedValue({ isRight: () => false }),
  })),
}));

vi.mock('~features/home/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('~features/home/ProjectsSection', () => ({
  ProjectsSection: () => <div data-testid="projects-section" />,
  ProjectsSkeleton: () => null,
}));

describe('Home page', () => {
  it('should render all feature sections', async () => {
    const { default: Home } = await import('~/app/[locale]/page');
    render(
      await Home({ params: Promise.resolve({ locale: 'en-US' }) }),
    );

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('projects-section')).toBeInTheDocument();
  });
});
