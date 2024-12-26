'use client';

import { createContext } from 'react';

export interface IAccordionContext {
  expanded: boolean;
  toggle?: () => void;
}

export const AccordionContext = createContext<IAccordionContext>({
  expanded: false,
});

export const AccordionProvider = AccordionContext.Provider;

AccordionContext.displayName = 'AccordionContext';
