'use client';

import { FC } from 'react';

import classNames from 'classnames';

import { Icon } from '../../Imagery/Icon';

const BASE =
  'inline-flex flex-row items-center bg-surface-raised py-1 px-3 rounded-badge text-body-xs !text-content-primary';

interface IBadgeTextProps {
  label: string;
  className?: string;
}

const Text: FC<IBadgeTextProps> = ({ label, className }) => (
  <span className={classNames(BASE, className)}>{label}</span>
);

interface IBadgeWithIconProps {
  label: string;
  icon: string;
  className?: string;
}

const WithIcon: FC<IBadgeWithIconProps> = ({ label, icon, className }) => (
  <span className={classNames(BASE, 'gap-x-2', className)}>
    <Icon icon={icon} className="text-base min-w-fit" />
    {label}
  </span>
);

interface IBadgeCountProps {
  count: number;
  className?: string;
}

const Count: FC<IBadgeCountProps> = ({ count, className }) => (
  <span className={classNames(BASE, 'gap-x-2.5', className)}>+{count}</span>
);

export const Badge = { Text, WithIcon, Count };
export type { IBadgeTextProps, IBadgeWithIconProps, IBadgeCountProps };
