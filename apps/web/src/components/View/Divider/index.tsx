'use client';

import { FC } from 'react';

import classNames from 'classnames';

export interface IDividerProps {
  className?: string;
}

export const Divider: FC<IDividerProps> = ({ className }) => {
  return (
    <hr
      className={classNames(
        'my-8 border-0 !border-t-2 border-gray-200 dark:border-dark-400',
        className,
      )}
    />
  );
};
