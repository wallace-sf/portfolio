'use client';

import { FC } from 'react';

import { Accordion } from '@repo/ui/Control';
import classNames from 'classnames';

import { Icon } from '~components/Imagery';

import { Text } from '../../Text';
import { IMenuItemProps } from '../../types';
import { ROOT_STYLE } from '../constants';
import { Container } from '../Container';

export interface IExpandableProps extends IMenuItemProps {
  title?: string;
}

export const Expandable: FC<IExpandableProps> = ({
  icon,
  children,
  className,
  iconClassName,
  title,
}) => {
  return (
    <Accordion.Root>
      {({ expanded, toggle }) => (
        <div
          className={classNames(
            ROOT_STYLE,
            'flex-col cursor-pointer',
            className,
          )}
          onClick={toggle}
          role="presentation"
        >
          <Accordion.Header className="w-full">
            <Container>
              <Icon icon={icon} className={iconClassName} />
              <Text className="!text-white">{title}</Text>
            </Container>
            <Icon
              icon="material-symbols:arrow-drop-down"
              className={classNames('text-dark-1000 transition-all', {
                'rotate-180': expanded,
              })}
            />
          </Accordion.Header>
          <Accordion.Body className="w-full">{children}</Accordion.Body>
        </div>
      )}
    </Accordion.Root>
  );
};
