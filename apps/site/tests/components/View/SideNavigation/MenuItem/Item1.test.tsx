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
});
