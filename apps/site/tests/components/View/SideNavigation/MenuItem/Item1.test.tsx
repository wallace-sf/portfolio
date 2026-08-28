import { render, screen, fireEvent } from '@testing-library/react';

import { Item1 } from '~/components/Layout/SideNavigation/MenuItem/Item1';

const mockCloseMenu = vi.fn();

vi.mock('next-intl', () => ({
  useLocale: () => 'en-US',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en-US/about',
}));

vi.mock('~/components/Layout/SideNavigation/context', () => ({
  useSideNavigation: () => ({ closeMenu: mockCloseMenu }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Item1', () => {
  it('should call closeMenu when the link is clicked', () => {
    render(
      <Item1 href="/projects" icon="material-symbols:deployed-code">
        Projects
      </Item1>,
    );

    fireEvent.click(screen.getByText('Projects'));

    expect(mockCloseMenu).toHaveBeenCalledOnce();
  });

  it('should prefix the href with the active locale by default', () => {
    render(
      <Item1 href="/projects" icon="material-symbols:deployed-code">
        Projects
      </Item1>,
    );

    expect(screen.getByText('Projects').closest('a')).toHaveAttribute(
      'href',
      '/en-US/projects',
    );
  });

  it('should use the href verbatim when localize is false', () => {
    render(
      <Item1
        href="/blog/en-US"
        icon="material-symbols:article"
        localize={false}
      >
        Blog
      </Item1>,
    );

    expect(screen.getByText('Blog').closest('a')).toHaveAttribute(
      'href',
      '/blog/en-US',
    );
  });
});
