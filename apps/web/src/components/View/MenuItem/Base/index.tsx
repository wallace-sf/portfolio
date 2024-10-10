'use client';

import { FC, ReactNode } from 'react';

import classNames from 'classnames';

import { Root, IRootProps } from '../Root';

export interface IBaseProps extends IRootProps {
  icon?: ReactNode;
}

export const Base: FC<IBaseProps> = ({ icon, children, ...props }) => {
  return (
    <Root
      {...props}
      className={classNames(
        'flex flex-row hover:bg-dark-300 active:bg-dark-400 transition-all px-4 py-3 gap-y-4 rounded-lg [&>span]:hover:font-bold [&>span]:active:font-bold [&>span]:active:!text-white',
        props.className,
      )}
    >
      {icon}
      <span className="text-body-sm font-normal !text-dark-900 line-clamp-1">
        {children}
      </span>
    </Root>
  );
};
