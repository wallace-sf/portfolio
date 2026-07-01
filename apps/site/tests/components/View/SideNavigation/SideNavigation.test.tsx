/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en-US',
}));

const mockSetFalse = vi.fn();

vi.mock('usehooks-ts', () => ({
  useBoolean: () => ({ value: false, toggle: vi.fn(), setFalse: mockSetFalse }),
  useScrollLock: vi.fn(),
}));

vi.mock('~hooks', () => ({
  useBreakpoint: () => true,
}));

vi.mock('~/components/Layout/Header', () => ({
  Header: () => <div data-testid="header" />,
}));

vi.mock('~/components/Layout/SideNavigation/MenuItem', async () => {
  const { useSideNavigation } = await vi.importActual<
    typeof import('~/components/Layout/SideNavigation/context')
  >('~/components/Layout/SideNavigation/context');

  const Item1 = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    const { closeMenu } = useSideNavigation();
    return (
      <a href={href} onClick={closeMenu}>
        {children}
      </a>
    );
  };

  return {
    MenuItem: {
      Item1,
      Item2: {
        Link: ({
          children,
          href,
        }: {
          children: React.ReactNode;
          href: string;
        }) => <a href={href}>{children}</a>,
      },
    },
  };
});

vi.mock('~/components/Layout/SideNavigation/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('~/components/Layout/SideNavigation/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector" />,
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SideNavigation', () => {
  it('should render ul elements with only li as direct children', async () => {
    const { SideNavigation } = await import(
      '~/components/Layout/SideNavigation'
    );
    const { container } = render(React.createElement(SideNavigation));

    const lists = container.querySelectorAll('ul');
    expect(lists.length).toBeGreaterThanOrEqual(2);

    lists.forEach((ul) => {
      Array.from(ul.children).forEach((child) => {
        expect(child.tagName).toBe('LI');
      });
    });
  });

  it('should provide closeMenu to descendants via SideNavigationContext', async () => {
    const { SideNavigation } = await import(
      '~/components/Layout/SideNavigation'
    );
    render(React.createElement(SideNavigation));

    fireEvent.click(screen.getByText('home'));

    expect(mockSetFalse).toHaveBeenCalledOnce();
  });
});
