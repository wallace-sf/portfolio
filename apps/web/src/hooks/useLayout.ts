import { useCallback, useContext } from 'react';

import invariant from 'tiny-invariant';

import { LayoutContext } from '~contexts';

export const useLayout = () => {
  const context = useContext(LayoutContext);

  invariant(context, 'useLayout must be used within a LayoutProvider.');

  const { open, toggle } = context;

  return {
    open,
    toggle: useCallback(() => {
      if (toggle != null) toggle();
    }, [toggle]),
  };
};
