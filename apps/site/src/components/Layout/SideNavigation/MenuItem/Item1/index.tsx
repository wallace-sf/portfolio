'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { useLocale } from 'next-intl';
import Link from 'next/link';

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
  const locale = useLocale();
  const localizedHref = href === '/' ? `/${locale}` : `/${locale}${href}`;
  const newHref = newTab ? href : localizedHref;

  return (
    <Link
      href={newHref}
      className={classNames(
        'flex flex-row items-center justify-between hover:bg-surface active:bg-surface-sunken transition-all px-4 py-3 rounded-lg [&_span]:hover:font-bold [&_span]:active:font-bold [&_*]:active:!text-content-primary',
        className,
      )}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <div className="flex flex-row items-center gap-x-4">
        <Icon
          className={classNames('text-content-secondary', iconClassName)}
          icon={icon}
        />
        <Text className="font-bold !text-content-secondary">{children}</Text>
      </div>
      {newTab ? (
        <Icon icon="material-symbols:open-in-new" className="text-dark-1000" />
      ) : null}
    </Link>
  );
};
