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

  it('should throw when used outside a SideNavigationProvider', () => {
    expect(() => renderHook(() => useSideNavigation())).toThrow(
      'useSideNavigation must be used within a SideNavigationProvider.',
    );
  });
});
