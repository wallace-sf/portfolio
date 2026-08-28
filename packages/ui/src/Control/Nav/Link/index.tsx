'use client';

import { AnchorHTMLAttributes, ElementType } from 'react';

import classNames from 'classnames';

import { Icon, IconProps } from '~/Imagery/Icon';

import { ROOT_STYLE } from '../constants';
import { Container } from '../Container';
import { Text } from '../Text';

export interface INavLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  /** Final href — the caller resolves any locale/zone prefix. */
  href: string;
  icon?: IconProps['icon'];
  iconClassName?: string;
  /** Renders the "open in new tab" glyph and sets `target`/`rel`. */
  external?: boolean;
  /** Called on click — the app wires its drawer `closeMenu` here. */
  onNavigate?: () => void;
  /** Injected router link (e.g. `next/link`); defaults to a plain anchor. */
  component?: ElementType;
}

/**
 * Headless bordered navigation link: icon + label, with an optional
 * "open in new tab" affordance.
 */
export const NavLink = ({
  children,
  className,
  href,
  icon,
  iconClassName,
  external = false,
  onNavigate,
  component: Component = 'a',
  ...props
}: INavLinkProps) => {
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
        <Text className="!text-content-primary">{children}</Text>
      </Container>
      {external ? (
        <Icon
          icon="material-symbols:open-in-new"
          className="text-content-disabled"
        />
      ) : null}
    </Component>
  );
};
