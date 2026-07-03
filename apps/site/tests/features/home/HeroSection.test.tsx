/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
}));

vi.mock('~assets/images/hero-landing-page.png', () => ({
  default: '/hero.png',
}));

vi.mock('~features/shared/HeroBanner', () => ({
  HeroBanner: ({
    title,
    caption,
    titleAs,
  }: {
    title: string;
    caption: string;
    titleAs?: string;
  }) => (
    <div data-testid="hero-banner" data-title-as={titleAs}>
      <span data-testid="hero-title">{title}</span>
      <span data-testid="hero-caption">{caption}</span>
    </div>
  ),
}));

vi.mock('~features/shared/StatCard', () => ({
  StatCard: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="stat-card">
      {label}: {value}
    </div>
  ),
}));

const PROFILE = {
  id: '1',
  name: 'Wallace Ferreira',
  headline: 'Frontend Engineer',
  bio: 'Bio text.',
  photo: { url: 'https://example.com/photo.jpg', alt: 'Profile photo' },
  stats: [{ label: 'Years', value: '6+', icon: 'mdi:calendar' }],
  socialNetworks: [],
};

describe('home/HeroSection', () => {
  it('should render banner with profile data when profile is provided', async () => {
    const { HeroSection } = await import('~features/home/HeroSection');
    render(await HeroSection({ locale: 'en-US', profile: PROFILE }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent('Wallace Ferreira');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent('Frontend Engineer');
  });

  it('should render banner with i18n fallback when profile is null', async () => {
    const { HeroSection } = await import('~features/home/HeroSection');
    render(await HeroSection({ locale: 'en-US', profile: null }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent('t.hero_title');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent('t.hero_caption');
  });

  it('should render stat cards when profile has stats', async () => {
    const { HeroSection } = await import('~features/home/HeroSection');
    render(await HeroSection({ locale: 'en-US', profile: PROFILE }));

    expect(screen.getByTestId('stat-card')).toBeInTheDocument();
  });

  it('should not render stat cards when profile has no stats', async () => {
    const { HeroSection } = await import('~features/home/HeroSection');
    render(
      await HeroSection({ locale: 'en-US', profile: { ...PROFILE, stats: [] } }),
    );

    expect(screen.queryByTestId('stat-card')).not.toBeInTheDocument();
  });

  it('should not render stat cards when profile is null', async () => {
    const { HeroSection } = await import('~features/home/HeroSection');
    render(await HeroSection({ locale: 'en-US', profile: null }));

    expect(screen.queryByTestId('stat-card')).not.toBeInTheDocument();
  });

  it('should render HeroBanner with titleAs h1', async () => {
    const { HeroSection } = await import('~features/home/HeroSection');
    render(await HeroSection({ locale: 'en-US', profile: PROFILE }));

    expect(screen.getByTestId('hero-banner')).toHaveAttribute('data-title-as', 'h1');
  });
});
