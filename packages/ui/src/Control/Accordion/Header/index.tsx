'use client';

import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { useAccordion } from '../useAccordion';

export interface IHeaderProps extends PropsWithChildren {
  className?: string;
}

export const Header: FC<IHeaderProps> = ({ children, className }) => {
  const { expanded, toggle } = useAccordion();

  return (
    <button
      type="button"
      aria-expanded={expanded}
      className={classNames(
        'flex flex-row justify-between items-center w-full',
        className,
      )}
      onClick={toggle}
    >
      {children}
    </button>
  );
};
