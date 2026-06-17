'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const localizedHref = href === '/' ? `/${locale}` : `/${locale}${href}`;
  const newHref = newTab ? href : localizedHref;

  const isRoot = localizedHref === `/${locale}`;
  const isActive =
    !newTab &&
    (isRoot
      ? pathname === localizedHref
      : pathname === localizedHref || pathname.startsWith(`${localizedHref}/`));

  return (
    <Link
      href={newHref}
      aria-current={isActive ? 'page' : undefined}
      className={classNames(
        'flex flex-row items-center justify-between transition-all px-4 py-3 rounded-lg',
        isActive
          ? 'bg-brand-primary [&_span]:font-bold [&_*]:!text-white'
          : 'hover:bg-surface active:bg-surface-sunken [&_span]:hover:font-bold [&_span]:active:font-bold [&_*]:active:!text-content-primary',
        className,
      )}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <div className="flex flex-row items-center gap-x-4">
        <Icon
          className={classNames(
            isActive ? 'text-white' : 'text-content-secondary',
            iconClassName,
          )}
          icon={icon}
        />
        <Text
          className={classNames(
            'font-bold',
            isActive ? '!text-white' : '!text-content-secondary',
          )}
        >
          {children}
        </Text>
      </div>
      {newTab ? (
        <Icon
          icon="material-symbols:open-in-new"
          className="text-content-disabled"
        />
      ) : null}
    </Link>
  );
};
