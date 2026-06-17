'use client';

import { createContext } from 'react';

export interface IAccordionContext {
  expanded: boolean;
  toggle?: () => void;
  panelId: string;
}

export const AccordionContext = createContext<IAccordionContext>({
  expanded: false,
  panelId: '',
});

export const AccordionProvider = AccordionContext.Provider;

AccordionContext.displayName = 'AccordionContext';
