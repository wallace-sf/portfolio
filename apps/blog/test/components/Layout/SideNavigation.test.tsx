import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SideNavigation } from '~/components/Layout/SideNavigation';

const mockCloseMenu = vi.fn();

vi.mock('~/config/env', () => ({
  env: {
    linkedinUrl: 'https://linkedin.com/in/wallace',
    githubUrl: 'https://github.com/wallace-sf',
  },
}));

vi.mock('~/lib/resume', () => ({
  getResumeUrl: (locale: string) => `https://cdn.example.com/resume-${locale}.pdf`,
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@repo/layout', () => ({
  buildCrossZoneHref: (zone: string, locale: string, path = '') =>
    `/${locale}${path === '/' ? '' : path}?zone=${zone}`,
}));

const useNavLink = vi.fn((path: string) => ({
  href: path === '/' ? '/en-US' : `/en-US${path}`,
  active: false,
}));

vi.mock('@repo/layout/SideNav', () => ({
  useNavLink: (path: string) => useNavLink(path),
  SideNav: ({
    locale,
    primary,
    secondary,
  }: {
    locale: string;
    primary: (ctx: { closeMenu: () => void }) => ReactNode;
    secondary: (ctx: { closeMenu: () => void }) => ReactNode;
  }) => (
    <nav data-testid="side-nav" data-locale={locale}>
      <ul>{primary({ closeMenu: mockCloseMenu })}</ul>
      <ul>{secondary({ closeMenu: mockCloseMenu })}</ul>
    </nav>
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
    children: ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick} data-next-link>
      {children}
    </a>
  ),
}));

vi.mock('@repo/ui/Control', () => {
  const link = ({
    children,
    href,
    external,
    active,
    onNavigate,
  }: {
    children: ReactNode;
    href: string;
    external?: boolean;
    active?: boolean;
    onNavigate?: () => void;
  }) => (
    <a
      href={href}
      onClick={onNavigate}
      data-external={external ? 'true' : undefined}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </a>
  );
  return { Nav: { Item: link, Link: link } };
});

beforeEach(() => {
  vi.clearAllMocks();
  useNavLink.mockImplementation((path: string) => ({
    href: path === '/' ? '/en-US' : `/en-US${path}`,
    active: false,
  }));
});

describe('SideNavigation', () => {
  it('should render the shared SideNav shell with the active locale', () => {
    render(<SideNavigation locale="pt-BR" />);

    expect(screen.getByTestId('side-nav')).toHaveAttribute(
      'data-locale',
      'pt-BR',
    );
  });

  it('should point the portfolio links at the site zone carrying the locale', () => {
    render(<SideNavigation locale="en-US" />);

    expect(screen.getByText('home').closest('a')).toHaveAttribute(
      'href',
      '/en-US?zone=site',
    );
    expect(screen.getByText('projects').closest('a')).toHaveAttribute(
      'href',
      '/en-US/projects?zone=site',
    );
    expect(screen.getByText('about').closest('a')).toHaveAttribute(
      'href',
      '/en-US/about?zone=site',
    );
  });

  it('should never mark the portfolio links as active', () => {
    render(<SideNavigation locale="en-US" />);

    for (const label of ['home', 'projects', 'about']) {
      expect(screen.getByText(label).closest('a')).not.toHaveAttribute(
        'aria-current',
      );
    }
  });

  it('should render the Resume link as an external portfolio link', () => {
    render(<SideNavigation locale="es" />);

    const resume = screen.getByText('resume').closest('a');
    expect(resume).toHaveAttribute(
      'href',
      'https://cdn.example.com/resume-es.pdf',
    );
    expect(resume).toHaveAttribute('data-external', 'true');
  });

  it('should mark the Blog Home link active on the listing route', () => {
    useNavLink.mockImplementation((path: string) => ({
      href: path === '/' ? '/en-US' : `/en-US${path}`,
      active: path === '/',
    }));
    render(<SideNavigation locale="en-US" />);

    const blogHome = screen.getByText('blogHome').closest('a');
    expect(blogHome).toHaveAttribute('href', '/en-US');
    expect(blogHome).toHaveAttribute('aria-current', 'page');
  });

  it('should not mark the Blog Home link active on a post detail route', () => {
    render(<SideNavigation locale="en-US" />);

    expect(screen.getByText('blogHome').closest('a')).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('should render the social links as external, RSS scoped to the locale', () => {
    render(<SideNavigation locale="en-US" />);

    expect(screen.getByText('linkedin').closest('a')).toHaveAttribute(
      'data-external',
      'true',
    );
    expect(screen.getByText('github').closest('a')).toHaveAttribute(
      'data-external',
      'true',
    );

    const rss = screen.getByText('rss').closest('a');
    expect(rss).toHaveAttribute('href', '/en-US/rss.xml');
    expect(rss).toHaveAttribute('data-external', 'true');
  });

  it('should render the theme and language controls', () => {
    render(<SideNavigation locale="en-US" />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('should close the mobile drawer when a nav item is clicked', () => {
    render(<SideNavigation locale="en-US" />);

    fireEvent.click(screen.getByText('home'));
    fireEvent.click(screen.getByText('blogHome'));
    fireEvent.click(screen.getByText('linkedin'));

    expect(mockCloseMenu).toHaveBeenCalledTimes(3);
  });

  it('should wrap every nav entry in a list item', () => {
    const { container } = render(<SideNavigation locale="en-US" />);

    const lists = container.querySelectorAll('ul');
    expect(lists.length).toBeGreaterThanOrEqual(2);
    lists.forEach((ul) => {
      Array.from(ul.children).forEach((child) => {
        expect(child.tagName).toBe('LI');
      });
    });
  });
});
