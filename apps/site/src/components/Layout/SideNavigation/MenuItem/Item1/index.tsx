'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en-US';
  const localizedHref = href === '/' ? `/${locale}` : `/${locale}${href}`;

  return (
    <Link
      href={localizedHref}
      className={classNames(
        'flex flex-row items-center hover:bg-surface active:bg-surface-sunken transition-all px-4 py-3 gap-4 rounded-lg [&>span]:hover:font-bold [&>span]:active:font-bold [&>*]:active:!text-content-primary',
        className,
      )}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <Icon
        className={classNames('text-content-secondary', iconClassName)}
        icon={icon}
      />
      <Text className="!text-content-secondary">{children}</Text>
    </Link>
  );
};
