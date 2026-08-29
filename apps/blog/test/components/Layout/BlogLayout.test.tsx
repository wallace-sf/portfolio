import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const scrollLock = vi.fn();
vi.mock('usehooks-ts', async () => {
  const { useState } = await import('react');
  return {
    useBoolean: (initial: boolean) => {
      const [value, setValue] = useState(initial);
      return {
        value,
        setTrue: () => setValue(true),
        setFalse: () => setValue(false),
        toggle: () => setValue((v) => !v),
      };
    },
    useScrollLock: (opts: { autoLock: boolean }) => scrollLock(opts.autoLock),
  };
});

vi.mock('~/components/Layout/SideNavigation', () => ({
  SideNavigation: ({
    isOpen,
    onToggle,
  }: {
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <button type="button" data-open={isOpen} onClick={onToggle}>
      toggle
    </button>
  ),
}));

describe('BlogLayout', () => {
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

  it('should toggle the drawer open state when the header hamburger fires onToggle', async () => {
    render(<BlogLayout locale="en-US">x</BlogLayout>);
    const toggle = screen.getByRole('button', { name: 'toggle' });

    expect(toggle).toHaveAttribute('data-open', 'false');

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('data-open', 'true');
  });

  it('should drive the body scroll lock from the drawer state', async () => {
    render(<BlogLayout locale="en-US">x</BlogLayout>);

    expect(scrollLock).toHaveBeenLastCalledWith(false);

    await userEvent.click(screen.getByRole('button', { name: 'toggle' }));

    expect(scrollLock).toHaveBeenLastCalledWith(true);
  });
});
