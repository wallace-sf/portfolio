import { FC } from 'react';

import classNames from 'classnames';

import { Icon, IconProps } from '../Icon';
import { Root, IRootProps } from '../Root';
import { Text } from '../Text';

export interface IDefaultProps extends IRootProps {
  icon?: IconProps['icon'];
}

export const Default: FC<IDefaultProps> = ({
  children,
  href,
  className,
  icon,
}) => {
  return (
    <Root
      href={href}
      className={classNames(
        'flex flex-row items-center hover:bg-dark-300 active:bg-dark-400 transition-all px-4 py-3 gap-4 rounded-lg [&>span]:hover:font-bold [&>span]:active:font-bold [&>*]:active:!text-white',
        className,
      )}
    >
      <Icon className="text-dark-900" icon={icon} />
      <Text className="!text-dark-900">{children}</Text>
    </Root>
  );
};
