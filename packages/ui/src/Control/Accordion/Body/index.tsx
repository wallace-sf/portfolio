'use client';

import { FC, PropsWithChildren, useMemo, useRef } from 'react';

import classNames from 'classnames';

import { useAccordion } from '../useAccordion';

export interface IBodyProps extends PropsWithChildren {
  className?: string;
}

export const Body: FC<IBodyProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { expanded } = useAccordion();

  const style = useMemo(
    () => ({
      maxHeight: expanded ? `${ref.current?.scrollHeight ?? 0}px` : '0px',
    }),
    [expanded],
  );

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(
        'overflow-hidden transition-all duration-300 ease-in-out',
        className,
      )}
    >
      {children}
    </div>
  );
};
