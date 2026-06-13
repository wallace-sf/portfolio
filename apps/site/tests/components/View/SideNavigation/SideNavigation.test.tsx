/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en-US',
}));

vi.mock('usehooks-ts', () => ({
  useBoolean: () => ({ value: false, toggle: vi.fn() }),
  useScrollLock: vi.fn(),
}));

vi.mock('~hooks', () => ({
  useBreakpoint: () => true,
}));

vi.mock('~/components/Layout/Header', () => ({
  Header: () => <div data-testid="header" />,
}));

vi.mock('~/components/Layout/SideNavigation/MenuItem', () => ({
  MenuItem: {
    Item1: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
    Item2: {
      Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
      ),
    },
  },
}));

vi.mock('~/components/Layout/SideNavigation/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('~/components/Layout/SideNavigation/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid="language-selector" />,
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

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
});
