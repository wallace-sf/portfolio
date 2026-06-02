import { createContext } from 'react';

import { DummyFn } from '~types';

export interface ILayoutContext {
  open: boolean;
  toggle: DummyFn | null;
  close: DummyFn | null;
}

export const LayoutContext = createContext<ILayoutContext>({
  open: false,
  toggle: null,
  close: null,
});

export const LayoutProvider = LayoutContext.Provider;

LayoutContext.displayName = 'LayoutContext';
