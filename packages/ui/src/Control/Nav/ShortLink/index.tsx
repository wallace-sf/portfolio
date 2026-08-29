'use client';

import { AnchorHTMLAttributes, ElementType } from 'react';

import classNames from 'classnames';

import { Icon, IconProps } from '~/Imagery/Icon';

import { ROOT_STYLE } from '../constants';
import { Container } from '../Container';

export interface INavShortLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  /** Final href — the caller resolves any locale/zone prefix. */
  href: string;
  icon?: IconProps['icon'];
  iconClassName?: string;
  /** Required — the link has no visible label. */
  'aria-label': string;
  /** Sets `target`/`rel` for links that open in a new tab. */
  external?: boolean;
  /** Called on click — the app wires its drawer `closeMenu` here. */
  onNavigate?: () => void;
  /** Injected router link (e.g. `next/link`); defaults to a plain anchor. */
  component?: ElementType;
}

/** Headless bordered icon-only navigation link. */
export const NavShortLink = ({
  className,
  href,
  icon,
  iconClassName,
  external = false,
  onNavigate,
  component: Component = 'a',
  ...props
}: INavShortLinkProps) => {
  return (
    <Component
      {...props}
      href={href}
      onClick={onNavigate}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={classNames(ROOT_STYLE, className)}
    >
      <Container>
        <Icon className={iconClassName} icon={icon} />
      </Container>
    </Component>
  );
};
