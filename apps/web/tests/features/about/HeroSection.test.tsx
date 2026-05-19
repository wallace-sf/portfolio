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

vi.mock('~assets/images/hero-about.png', () => ({
  default: '/hero-about.png',
}));

vi.mock('~features/shared/HeroBanner', () => ({
  HeroBanner: ({
    title,
    caption,
  }: {
    title: string;
    caption: string;
  }) => (
    <div data-testid="hero-banner">
      <span data-testid="hero-title">{title}</span>
      <span data-testid="hero-caption">{caption}</span>
    </div>
  ),
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

const PROFILE = {
  name: 'Wallace Ferreira',
  headline: 'Frontend Engineer',
  bio: 'Bio text.',
  photo: { url: 'https://example.com/photo.jpg', alt: 'Profile photo' },
};

describe('about/HeroSection', () => {
  it('should render banner with profile data when fetch succeeds', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: PROFILE, error: null }),
    });

    const { HeroSection } = await import('~features/about/HeroSection');
    render(await HeroSection());

    expect(screen.getByTestId('hero-title')).toHaveTextContent(
      'Wallace Ferreira',
    );
    expect(screen.getByTestId('hero-caption')).toHaveTextContent(
      'Frontend Engineer',
    );
  });

  it('should render banner with i18n fallback when fetch fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        data: null,
        error: { code: 'NOT_FOUND', message: '' },
      }),
    });

    const { HeroSection } = await import('~features/about/HeroSection');
    render(await HeroSection());

    expect(screen.getByTestId('hero-title')).toHaveTextContent('t.hero_title');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent(
      't.hero_caption',
    );
  });

  it('should render banner with i18n fallback when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { HeroSection } = await import('~features/about/HeroSection');
    render(await HeroSection());

    expect(screen.getByTestId('hero-title')).toHaveTextContent('t.hero_title');
  });
});
