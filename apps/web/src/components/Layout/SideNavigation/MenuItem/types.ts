import { ReactNode } from 'react';

import { IconifyIcon } from '@iconify/react';

export interface IMenuItemProps {
  children?: ReactNode;
  className?: string;
  icon?: IconifyIcon | string;
  iconClassName?: string;
}

export interface IGhostLinkProps extends IMenuItemProps {
  href: string;
  newTab?: boolean;
}
