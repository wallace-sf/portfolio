import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

export interface ISideNavigationContext {
  closeMenu: () => void;
}

export const SideNavigationContext =
  createContext<ISideNavigationContext | null>(null);

export const SideNavigationProvider = SideNavigationContext.Provider;

SideNavigationContext.displayName = 'SideNavigationContext';

export const useSideNavigation = () => {
  const context = useContext(SideNavigationContext);

  invariant(
    context,
    'useSideNavigation must be used within a SideNavigationProvider.',
  );

  return context;
};
