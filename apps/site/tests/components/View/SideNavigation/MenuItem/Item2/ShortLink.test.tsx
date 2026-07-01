import { render, screen, fireEvent } from '@testing-library/react';

import { ShortLink } from '~/components/Layout/SideNavigation/MenuItem/Item2/ShortLink';

const mockCloseMenu = vi.fn();

vi.mock('~/components/Layout/SideNavigation/context', () => ({
  useSideNavigation: () => ({ closeMenu: mockCloseMenu }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Item2.ShortLink', () => {
  it('should call closeMenu when the link is clicked', () => {
    render(
      <ShortLink
        href="https://github.com"
        icon="mdi:github"
        aria-label="GitHub"
      />,
    );

    fireEvent.click(screen.getByLabelText('GitHub'));

    expect(mockCloseMenu).toHaveBeenCalledOnce();
  });
});
