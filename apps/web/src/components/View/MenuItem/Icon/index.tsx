import { FC, createElement } from 'react';

import { Icon as Iconify, IconifyIcon as IconifyProps } from '@iconify/react';
import classNames from 'classnames';

export interface IconProps {
  icon?: IconifyProps | string;
  className?: string;
}

export const Icon: FC<IconProps> = ({ icon, className }) => {
  return icon != null
    ? createElement(Iconify, {
        icon,
        className: classNames('text-2xl', className),
      })
    : null;
};
