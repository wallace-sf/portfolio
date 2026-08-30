import { createContext, useContext } from 'react';

export interface ISideNavContext {
  closeMenu: () => void;
}

const noop = () => {};

export const SideNavContext = createContext<ISideNavContext>({
  closeMenu: noop,
});

export const SideNavProvider = SideNavContext.Provider;

SideNavContext.displayName = 'SideNavContext';

export const useSideNav = () => useContext(SideNavContext);
