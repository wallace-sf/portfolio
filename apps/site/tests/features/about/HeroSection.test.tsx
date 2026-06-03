/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
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

const mockExecute = vi.fn();

vi.mock('@repo/application/portfolio', () => ({
  GetProfile: vi.fn().mockImplementation(() => ({ execute: mockExecute })),
}));

vi.mock('~/lib/server/container', () => ({
  getServerContainer: vi.fn().mockReturnValue({
    profileRepository: {},
  }),
}));

const PROFILE = {
  name: 'Wallace Ferreira',
  headline: 'Frontend Engineer',
  bio: 'Bio text.',
  photo: { url: 'https://example.com/photo.jpg', alt: 'Profile photo' },
};

const right = (value: unknown) => ({ isRight: () => true, value });
const left = () => ({ isRight: () => false });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('about/HeroSection', () => {
  it('should render banner with profile data when use case succeeds', async () => {
    mockExecute.mockResolvedValue(right(PROFILE));

    const { HeroSection } = await import('~features/about/HeroSection');
    render(await HeroSection({ locale: 'en-US' }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent(
      'Frontend Engineer',
    );
    expect(screen.getByTestId('hero-caption')).toHaveTextContent(
      'Wallace Ferreira',
    );
  });

  it('should render banner with i18n fallback when use case fails', async () => {
    mockExecute.mockResolvedValue(left());

    const { HeroSection } = await import('~features/about/HeroSection');
    render(await HeroSection({ locale: 'en-US' }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent('t.hero_caption');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent(
      't.hero_title',
    );
  });

  it('should render banner with i18n fallback when use case throws', async () => {
    mockExecute.mockRejectedValue(new Error('Unexpected error'));

    const { HeroSection } = await import('~features/about/HeroSection');
    await expect(HeroSection({ locale: 'en-US' })).rejects.toThrow('Unexpected error');
  });
});
