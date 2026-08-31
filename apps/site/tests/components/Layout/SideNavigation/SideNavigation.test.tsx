/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  SideNavProvider,
  useSideNav,
} from '~/components/Layout/SideNavigation/context';

const activePath = { current: '' };

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en-US',
}));

vi.mock('~/hooks/useNavLink', () => ({
  useNavLink: (path: string) => ({
    href: path === '/' ? '/en-US' : `/en-US${path}`,
    active: path === activePath.current,
  }),
}));

vi.mock('~/config/env', () => ({
  env: {
    linkedinUrl: 'https://linkedin.com/in/x',
    githubUrl: 'https://github.com/x',
  },
}));

vi.mock('~/lib/resume', () => ({
  getResumeUrl: (locale: string) => `https://cv/${locale}.pdf`,
}));

vi.mock('~/components/Layout/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('~/components/Layout/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector" />,
}));

vi.mock('~/components/Layout/SiteHeader', () => ({
  SiteHeader: ({
    isOpen,
    onToggle,
  }: {
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <button type="button" data-open={isOpen} onClick={onToggle}>
      header
    </button>
  ),
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

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
    useMediaQuery: () => false,
    useScrollLock: vi.fn(),
  };
});

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

async function renderNav() {
  const { SideNavigation } = await import('~/components/Layout/SideNavigation');
  return render(<SideNavigation />);
}

describe('SideNavigation', () => {
  it('should render every primary and secondary nav item', async () => {
    await renderNav();

    for (const key of ['home', 'projects', 'about', 'blog', 'resume']) {
      expect(screen.getByText(key)).toBeInTheDocument();
    }
    expect(screen.getByText('linkedin')).toBeInTheDocument();
    expect(screen.getByText('github')).toBeInTheDocument();
    expect(screen.getByText('rss')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('should resolve route hrefs through the active locale', async () => {
    await renderNav();

    expect(screen.getByText('home').closest('a')).toHaveAttribute(
      'href',
      '/en-US',
    );
    expect(screen.getByText('blog').closest('a')).toHaveAttribute(
      'href',
      '/en-US/blog',
    );
    expect(screen.getByText('rss').closest('a')).toHaveAttribute(
      'href',
      '/en-US/feed.xml',
    );
  });

  it('should mark only the matching route item active', async () => {
    activePath.current = '/blog';
    await renderNav();

    expect(screen.getByText('blog').closest('a')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(screen.getByText('projects').closest('a')).toHaveAttribute(
      'data-active',
      'false',
    );
  });

  it('should wrap every nav item in an li', async () => {
    const { container } = await renderNav();

    container.querySelectorAll('ul').forEach((ul) => {
      Array.from(ul.children).forEach((child) =>
        expect(child.tagName).toBe('LI'),
      );
    });
  });

  it('should keep the drawer offscreen until the header toggles it open', async () => {
    await renderNav();
    const nav = screen.getByRole('navigation', { name: 'mainNav' });
    expect(nav).toHaveClass('translate-x-full');

    await userEvent.click(screen.getByRole('button', { name: 'header' }));

    expect(nav).toHaveClass('translate-x-0');
  });

  it('should close the drawer when a nav item is clicked', async () => {
    await renderNav();
    const nav = screen.getByRole('navigation', { name: 'mainNav' });

    await userEvent.click(screen.getByRole('button', { name: 'header' }));
    expect(nav).toHaveClass('translate-x-0');

    fireEvent.click(screen.getByText('home'));

    expect(nav).toHaveClass('translate-x-full');
  });
});

describe('SideNavigation context', () => {
  const Consumer = () => {
    const { closeMenu } = useSideNav();
    return (
      <button type="button" onClick={closeMenu}>
        close
      </button>
    );
  };

  it('should default closeMenu to a noop without a provider', () => {
    render(<Consumer />);
    expect(() => screen.getByRole('button').click()).not.toThrow();
  });

  it('should expose the provided closeMenu to descendants', () => {
    const closeMenu = vi.fn();
    render(
      <SideNavProvider value={{ closeMenu }}>
        <Consumer />
      </SideNavProvider>,
    );

    screen.getByRole('button').click();

    expect(closeMenu).toHaveBeenCalledTimes(1);
  });
});
