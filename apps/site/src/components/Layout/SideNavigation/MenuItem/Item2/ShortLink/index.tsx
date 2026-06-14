'use client';

import { FC } from 'react';

import { Icon } from '@repo/ui/Imagery';
import classNames from 'classnames';
import NextLink from 'next/link';

import { IGhostLinkProps } from '../../types';
import { ROOT_STYLE } from '../constants';
import { Container } from '../Container';

export const ShortLink: FC<IGhostLinkProps> = ({
  href,
  icon,
  className,
  iconClassName,
  newTab,
  'aria-label': ariaLabel,
}) => {
  return (
    <NextLink
      href={href}
      aria-label={ariaLabel}
      className={classNames(ROOT_STYLE, className)}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <Container>
        <Icon className={iconClassName} icon={icon} />
      </Container>
    </NextLink>
  );
};
