import { ReactNode } from 'react';

import { IconProps } from '@repo/ui/Imagery';

export interface IMenuItemProps {
  children?: ReactNode;
  className?: string;
  icon?: IconProps['icon'];
  iconClassName?: string;
}

export interface IGhostLinkProps extends IMenuItemProps {
  href: string;
  newTab?: boolean;
}
