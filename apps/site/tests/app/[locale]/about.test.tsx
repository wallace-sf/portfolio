/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

import enUS from '../../../messages/en-US.json';
import es from '../../../messages/es.json';
import ptBR from '../../../messages/pt-BR.json';

const MESSAGES: Record<string, unknown> = {
  'en-US': enUS,
  'pt-BR': ptBR,
  es,
};

function lookup(locale: string, path: string): string {
  return path
    .split('.')
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown>)[key],
      MESSAGES[locale],
    ) as string;
}

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations:
    async ({ locale, namespace }: { locale: string; namespace: string }) =>
    (key: string) =>
      lookup(locale, `${namespace}.${key}`),
}));

vi.mock('@repo/core/shared', () => ({
  DEFAULT_LOCALE: 'en-US',
  LOCALES: ['en-US', 'pt-BR', 'es'],
}));

vi.mock('~features/about/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('~features/about/BioSection', () => ({
  BioSection: () => <div data-testid="bio-section" />,
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

describe('About page', () => {
  it('should render all feature sections', async () => {
    const { default: About } = await import('~/app/[locale]/about/page');
    render(await About({ params: Promise.resolve({ locale: 'en-US' }) }));

    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('bio-section')).toBeInTheDocument();
    expect(screen.getByTestId('values-section')).toBeInTheDocument();
    expect(screen.getByTestId('experiences-section')).toBeInTheDocument();
    expect(screen.getByTestId('curriculum-cta')).toBeInTheDocument();
  });
});

describe('About page generateMetadata', () => {
  const MAX_DESCRIPTION_LENGTH = 155;

  it.each(['en-US', 'pt-BR', 'es'])(
    'should use the short translated summary as description when locale is %s',
    async (locale) => {
      const { generateMetadata } = await import('~/app/[locale]/about/page');
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale }),
      });

      const summary = lookup(locale, 'Metadata.AboutPage.description');
      expect(metadata.description).toBe(summary);
      expect(metadata.openGraph?.description).toBe(summary);
      expect(summary.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    },
  );

  it('should always include Open Graph data with a 1200x630 image when generated', async () => {
    const { generateMetadata } = await import('~/app/[locale]/about/page');
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en-US' }),
    });

    expect(metadata.openGraph?.title).toBe('About');
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ width: 1200, height: 630 }),
    ]);
  });
});
