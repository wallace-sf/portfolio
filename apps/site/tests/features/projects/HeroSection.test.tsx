/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => `t.${key}`),
}));

vi.mock('~assets/images/hero-projects.png', () => ({
  default: '/hero-projects.png',
}));

vi.mock('~features/shared/HeroBanner', () => ({
  HeroBanner: ({ title, caption }: { title: string; caption: string }) => (
    <div data-testid="hero-banner">
      <span data-testid="hero-title">{title}</span>
      <span data-testid="hero-caption">{caption}</span>
    </div>
  ),
}));

describe('projects/HeroSection', () => {
  it('should render banner with i18n content', async () => {
    const { HeroSection } = await import('~features/projects/HeroSection');
    render(await HeroSection({ locale: 'en-US' }));

    expect(screen.getByTestId('hero-title')).toHaveTextContent('t.hero_title');
    expect(screen.getByTestId('hero-caption')).toHaveTextContent('t.hero_caption');
  });
});
