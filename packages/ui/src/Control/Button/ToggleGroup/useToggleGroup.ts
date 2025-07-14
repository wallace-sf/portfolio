import { useContext } from 'react';

import invariant from 'tiny-invariant';

import { ToggleGroupContext } from './context';

export const useToggleGroup = () => {
  const context = useContext(ToggleGroupContext);

  invariant(
    context,
    'useToggleGroup must be used within a ToggleGroupProvider.',
  );

  return context;
};
