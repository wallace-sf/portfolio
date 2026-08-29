import { render, screen } from '@testing-library/react';

import { SideNavProvider, useSideNav } from '~/SideNav/context';

const Consumer = () => {
  const { closeMenu } = useSideNav();
  return (
    <button type="button" onClick={closeMenu}>
      close
    </button>
  );
};

describe('SideNav context', () => {
  it('should default closeMenu to a noop when there is no provider', () => {
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
