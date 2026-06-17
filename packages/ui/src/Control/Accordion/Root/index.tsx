'use client';

import { type JSX, FC, ReactNode, useId, useMemo } from 'react';

import { useToggle } from 'usehooks-ts';

import { AccordionProvider, IAccordionContext } from '../context';

export type AccordionChildrenFn = (context: IAccordionContext) => JSX.Element;

export interface IAccordionRootProps {
  children?: AccordionChildrenFn | ReactNode;
}

export const Root: FC<IAccordionRootProps> = ({ children }) => {
  const [expanded, toggle] = useToggle(false);
  const panelId = useId();

  const value = useMemo(
    () => ({ expanded, toggle, panelId }),
    [expanded, toggle, panelId],
  );

  return (
    <AccordionProvider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AccordionProvider>
  );
};
