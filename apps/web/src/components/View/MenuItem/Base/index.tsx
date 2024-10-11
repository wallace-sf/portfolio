'use client';

import { FC, createElement, useMemo } from 'react';

import { Icon, IconifyIcon } from '@iconify/react';
import classNames from 'classnames';

import { Root, IRootProps } from '../Root';

export interface IBaseProps extends IRootProps {
  icon?: string | IconifyIcon;
}

export const Base: FC<IBaseProps> = ({ icon, children, ...props }) => {
  const renderedIcon = useMemo(
    () =>
      icon != null
        ? createElement(Icon, { icon, className: 'text-dark-900 text-2xl' })
        : null,
    [icon],
  );

  return (
    <Root
      {...props}
      className={classNames(
        'flex flex-row items-center hover:bg-dark-300 active:bg-dark-400 transition-all px-4 py-3 gap-4 rounded-lg [&>span]:hover:font-bold [&>span]:active:font-bold [&>*]:active:!text-white',
        props.className,
      )}
    >
      {renderedIcon}
      <span className="text-body-sm font-normal !text-dark-900 line-clamp-1">
        {children}
      </span>
    </Root>
  );
};
