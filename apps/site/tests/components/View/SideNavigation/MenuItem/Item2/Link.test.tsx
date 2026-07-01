import { render, screen, fireEvent } from '@testing-library/react';

import { Link } from '~/components/Layout/SideNavigation/MenuItem/Item2/Link';

const mockCloseMenu = vi.fn();

vi.mock('~/components/Layout/SideNavigation/context', () => ({
  useSideNavigation: () => ({ closeMenu: mockCloseMenu }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Item2.Link', () => {
  it('should call closeMenu when the link is clicked', () => {
    render(
      <Link href="https://linkedin.com" icon="devicon:linkedin" newTab>
        LinkedIn
      </Link>,
    );

    fireEvent.click(screen.getByText('LinkedIn'));

    expect(mockCloseMenu).toHaveBeenCalledOnce();
  });
});
