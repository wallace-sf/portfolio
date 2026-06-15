'use client';

import { useCallback, useContext } from 'react';

import invariant from 'tiny-invariant';

import { AccordionContext } from './context';

export const useAccordion = () => {
  const context = useContext(AccordionContext);

  invariant(context, 'useAccordion must be used within an AccordionProvider.');

  const { expanded, toggle, panelId } = context;

  return {
    expanded,
    panelId,
    toggle: useCallback(() => {
      if (toggle != null) toggle();
    }, [toggle]),
  };
};
