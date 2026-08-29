import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { BlogLayout } from '~/components/Layout/BlogLayout';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    key === 'copyright' ? `copyright ${values?.year}` : key,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@repo/layout', () => ({
  buildCrossZoneHref: (_zone: string, locale: string) => `/${locale}`,
}));

vi.mock('@repo/layout/SiteFooter', () => ({
  SiteFooter: ({ children }: { children: ReactNode }) => (
    <footer>{children}</footer>
  ),
}));

vi.mock('~/components/Layout/SideNavigation', () => ({
  SideNavigation: ({ locale }: { locale: string }) => (
    <nav data-testid="side-nav" data-locale={locale} />
  ),
}));

describe('BlogLayout', () => {
  it('should render the side navigation with the locale', () => {
    render(<BlogLayout locale="es">x</BlogLayout>);
    expect(screen.getByTestId('side-nav')).toHaveAttribute('data-locale', 'es');
  });

  it('should render the children inside the content column', () => {
    render(
      <BlogLayout locale="en-US">
        <p>post body</p>
      </BlogLayout>,
    );
    expect(screen.getByText('post body')).toBeInTheDocument();
  });

  it('should render a footer with the copyright and a back-to-portfolio link', () => {
    render(<BlogLayout locale="pt-BR">x</BlogLayout>);

    expect(
      screen.getByText(`copyright ${new Date().getFullYear()}`),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'backToPortfolio' }),
    ).toHaveAttribute('href', '/pt-BR');
  });
});
