'use client';

import { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { Icon, IconProps } from '~/Imagery/Icon';

import { Accordion } from '../../Accordion';
import { Container } from '../Container';
import { ROOT_STYLE } from '../constants';
import { Text } from '../Text';

export interface INavExpandableProps extends PropsWithChildren {
  icon?: IconProps['icon'];
  iconClassName?: string;
  title?: string;
  className?: string;
}

/**
 * Headless accordion navigation shell: icon + title header with a rotating
 * caret, and a collapsible body. Selector logic (theme, language, …) stays
 * in the consuming app.
 */
export const NavExpandable: FC<INavExpandableProps> = ({
  icon,
  children,
  className,
  iconClassName,
  title,
}) => {
  return (
    <Accordion.Root>
      {({ expanded }) => (
        <div className={classNames(ROOT_STYLE, 'flex-col !p-0', className)}>
          <Accordion.Header className="w-full cursor-pointer !px-4 !py-3">
            <Container>
              <Icon icon={icon} className={iconClassName} />
              <Text className="!text-content-primary">{title}</Text>
            </Container>
            <Icon
              icon="material-symbols:arrow-drop-down"
              className={classNames('text-content-disabled transition-all', {
                'rotate-180': expanded,
              })}
            />
          </Accordion.Header>
          <Accordion.Body
            className={classNames('w-full !px-4', {
              '!mb-3': expanded,
            })}
          >
            {children}
          </Accordion.Body>
        </div>
      )}
    </Accordion.Root>
  );
};
