/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

const mockCloseMenu = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en-US',
}));

vi.mock('@repo/layout', () => ({
  buildCrossZoneHref: (_zone: string, locale: string) => `/blog/${locale}`,
}));

vi.mock('@repo/layout/SideNav', () => ({
  useNavLink: (path: string) => ({
    href: path === '/' ? '/en-US' : `/en-US${path}`,
    active: false,
  }),
  SideNav: ({
    primary,
    secondary,
  }: {
    primary: (ctx: { closeMenu: () => void }) => React.ReactNode;
    secondary: (ctx: { closeMenu: () => void }) => React.ReactNode;
  }) => (
    <div>
      <ul>{primary({ closeMenu: mockCloseMenu })}</ul>
      <ul>{secondary({ closeMenu: mockCloseMenu })}</ul>
    </div>
  ),
}));

vi.mock('@repo/layout/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('@repo/layout/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector" />,
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock('@repo/ui/Control', () => {
  const item = ({
    children,
    href,
    onNavigate,
  }: {
    children: React.ReactNode;
    href: string;
    onNavigate?: () => void;
  }) => (
    <a href={href} onClick={onNavigate}>
      {children}
    </a>
  );
  return { Nav: { Item: item, Link: item } };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SideNavigation', () => {
  it('should render ul elements with only li as direct children', async () => {
    const { SideNavigation } =
      await import('~/components/Layout/SideNavigation');
    const { container } = render(React.createElement(SideNavigation));

    const lists = container.querySelectorAll('ul');
    expect(lists.length).toBeGreaterThanOrEqual(2);
    lists.forEach((ul) => {
      Array.from(ul.children).forEach((child) => {
        expect(child.tagName).toBe('LI');
      });
    });
  });

  it('should close the mobile menu when a primary nav link is clicked', async () => {
    const { SideNavigation } =
      await import('~/components/Layout/SideNavigation');
    render(React.createElement(SideNavigation));

    fireEvent.click(screen.getByText('home'));

    expect(mockCloseMenu).toHaveBeenCalled();
  });

  it('should include a Blog link to the blog zone carrying the active locale', async () => {
    const { SideNavigation } =
      await import('~/components/Layout/SideNavigation');
    render(React.createElement(SideNavigation));

    expect(screen.getByText('blog').closest('a')).toHaveAttribute(
      'href',
      '/blog/en-US',
    );
  });
});
