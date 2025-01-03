'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import NextLink from 'next/link';

import { Text } from '../../Text';
import { IGhostLinkProps } from '../../types';
import { ROOT_STYLE } from '../constants';
import { Container } from '../Container';

export const Link: FC<IGhostLinkProps> = ({
  href,
  icon,
  children,
  className,
  iconClassName,
  newTab,
}) => {
  return (
    <NextLink
      href={href}
      className={classNames(ROOT_STYLE, className)}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <Container>
        <Icon className={iconClassName} icon={icon} />
        <Text className="!text-white">{children}</Text>
      </Container>
      <Icon icon="material-symbols:open-in-new" className="text-dark-1000" />
    </NextLink>
  );
};
