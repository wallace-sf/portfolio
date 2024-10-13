'use client';

import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

export interface IHeaderProps extends PropsWithChildren {
  className?: string;
}

export const Header: FC<IHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'flex flex-row justify-between items-center',
        className,
      )}
    >
      {children}
    </div>
  );
};
