'use client';

import { FC } from 'react';

import classNames from 'classnames';
import Link from 'next/link';

import { Icon } from '../Icon';
import { Text } from '../Text';
import { IGhostLinkProps } from '../types';

export const Item1: FC<IGhostLinkProps> = ({
  children,
  className,
  href,
  icon,
  iconClassName,
  newTab = false,
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        'flex flex-row items-center hover:bg-dark-300 active:bg-dark-400 transition-all px-4 py-3 gap-4 rounded-lg [&>span]:hover:font-bold [&>span]:active:font-bold [&>*]:active:!text-white',
        className,
      )}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <Icon
        className={classNames('text-dark-900', iconClassName)}
        icon={icon}
      />
      <Text className="!text-dark-900">{children}</Text>
    </Link>
  );
};
