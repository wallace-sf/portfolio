import { FC } from 'react';

import classNames from 'classnames';

import { Icon, IconProps } from '../../Icon';
import { Root, IRootProps } from '../../Root';
import { Text } from '../../Text';
import { Container } from '../Container';

export interface IDefaultProps extends IRootProps {
  icon?: IconProps['icon'];
  iconClassName?: string;
}

export const Default: FC<IDefaultProps> = ({
  href,
  icon,
  children,
  className,
  iconClassName,
}) => {
  return (
    <Root
      href={href}
      className={classNames(
        'flex flex-row justify-between items-center px-4 py-3 border border-dark-400 rounded-xl transition-all hover:bg-dark-300',
        className,
      )}
    >
      <Container>
        <Icon icon={icon} className={iconClassName} />
        <Text className="!text-white">{children}</Text>
      </Container>
      <Icon icon="material-symbols:open-in-new" className="text-dark-1000" />
    </Root>
  );
};
