'use client';

import { FC, ReactNode, useMemo } from 'react';

import { useToggle } from 'usehooks-ts';

import { AccordionProvider, IAccordionContext } from '../AccordionContext';

export type AccordionChildrenFn = (context: IAccordionContext) => JSX.Element;

export interface IAccordionRootProps {
  children?: AccordionChildrenFn | ReactNode;
}

export const Root: FC<IAccordionRootProps> = ({ children }) => {
  const [expanded, toggle] = useToggle(false);

  const value = useMemo(() => ({ expanded, toggle }), [expanded, toggle]);

  return (
    <AccordionProvider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </AccordionProvider>
  );
};
