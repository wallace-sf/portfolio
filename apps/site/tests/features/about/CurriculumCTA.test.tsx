/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl/server', () => ({
  getTranslations: vi
    .fn()
    .mockResolvedValue((key: string) => `cta.${key}`),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));

vi.mock('~assets/images/curriculum-cta-illustration.png', () => ({
  default: '/curriculum-cta-illustration.png',
}));

vi.mock('~/lib/resume', () => ({
  getResumeUrl: vi.fn((locale: string) => `https://resume.example.com/${locale}`),
}));

import { CurriculumCTA } from '~features/about/CurriculumCTA';

describe('CurriculumCTA', () => {
  it('should render the description text', async () => {
    render(await CurriculumCTA({ locale: 'en-US' }));
    expect(screen.getByText('cta.description')).toBeInTheDocument();
  });

  it('should render the button with label and open_in_new icon', async () => {
    render(await CurriculumCTA({ locale: 'en-US' }));
    expect(screen.getByText('cta.button')).toBeInTheDocument();
    expect(
      document.querySelector('[data-icon="material-symbols:open-in-new"]'),
    ).toBeInTheDocument();
  });

  it('should render a link that opens in new tab', async () => {
    render(
      await CurriculumCTA({ locale: 'en-US', resumeUrl: 'https://example.com/cv' }),
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/cv');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('should render the illustration image', async () => {
    render(await CurriculumCTA({ locale: 'en-US' }));
    expect(screen.getByAltText('cta.illustration_alt')).toBeInTheDocument();
  });

  it('should use locale-specific resume URL when no resumeUrl prop is given', async () => {
    render(await CurriculumCTA({ locale: 'pt-BR' }));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://resume.example.com/pt-BR');
  });

  it('should prefer explicit resumeUrl over locale-derived URL', async () => {
    render(await CurriculumCTA({ locale: 'pt-BR', resumeUrl: 'https://custom.com/cv' }));
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://custom.com/cv');
  });
});
