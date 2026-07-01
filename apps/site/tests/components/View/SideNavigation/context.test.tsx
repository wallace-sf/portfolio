/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen, fireEvent, renderHook } from '@testing-library/react';

import {
  SideNavigationProvider,
  useSideNavigation,
} from '~/components/Layout/SideNavigation/context';

const Consumer: React.FC = () => {
  const { closeMenu } = useSideNavigation();

  return <button onClick={closeMenu}>close</button>;
};

describe('SideNavigationContext', () => {
  it('should call the provided closeMenu when a consumer invokes it', () => {
    const mockCloseMenu = vi.fn();

    render(
      <SideNavigationProvider value={{ closeMenu: mockCloseMenu }}>
        <Consumer />
      </SideNavigationProvider>,
    );

    fireEvent.click(screen.getByText('close'));

    expect(mockCloseMenu).toHaveBeenCalledOnce();
  });

  it('should default closeMenu to a no-op when there is no provider', () => {
    const { result } = renderHook(() => useSideNavigation());

    expect(() => result.current.closeMenu()).not.toThrow();
  });
});
