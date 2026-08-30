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

const activePath = { current: '' };

vi.mock('@repo/layout/SideNav', () => ({
  useNavLink: (path: string) => ({
    href: path === '/' ? '/en-US' : `/en-US${path}`,
    active: path === activePath.current,
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
    active,
    onNavigate,
  }: {
    children: React.ReactNode;
    href: string;
    active?: boolean;
    onNavigate?: () => void;
  }) => (
    <a href={href} data-active={active ? 'true' : 'false'} onClick={onNavigate}>
      {children}
    </a>
  );
  return { Nav: { Item: item, Link: item } };
});

beforeEach(() => {
  vi.clearAllMocks();
  activePath.current = '';
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

  it('should link Blog to the locale-prefixed /blog route', async () => {
    const { SideNavigation } =
      await import('~/components/Layout/SideNavigation');
    render(React.createElement(SideNavigation));

    expect(screen.getByText('blog').closest('a')).toHaveAttribute(
      'href',
      '/en-US/blog',
    );
  });

  it('should mark the Blog link active on blog routes', async () => {
    activePath.current = '/blog';
    const { SideNavigation } =
      await import('~/components/Layout/SideNavigation');
    render(React.createElement(SideNavigation));

    expect(screen.getByText('blog').closest('a')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(screen.getByText('home').closest('a')).toHaveAttribute(
      'data-active',
      'false',
    );
  });
});
