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
        'h-[2px] my-10 bg-gray-200 border-0 dark:bg-dark-400',
        className,
      )}
    />
  );
};
