import { createContext, useContext } from 'react';

export interface ISideNavigationContext {
  closeMenu: () => void;
}

const noop = () => {};

export const SideNavigationContext = createContext<ISideNavigationContext>({
  closeMenu: noop,
});

export const SideNavigationProvider = SideNavigationContext.Provider;

SideNavigationContext.displayName = 'SideNavigationContext';

export const useSideNavigation = () => useContext(SideNavigationContext);
