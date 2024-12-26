'use client';

import { useCallback, useContext } from 'react';

import invariant from 'tiny-invariant';

import { AccordionContext } from './context';

export const useAccordion = () => {
  const context = useContext(AccordionContext);

  invariant(context, 'useAccordion must be used within an AccordionProvider.');

  const { expanded, toggle } = context;

  return {
    expanded,
    toggle: useCallback(() => {
      if (toggle != null) toggle();
    }, [toggle]),
  };
};
