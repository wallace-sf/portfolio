'use client';

import { AnchorHTMLAttributes, ElementType } from 'react';

import classNames from 'classnames';

import { Icon, IconProps } from '~/Imagery/Icon';

import { Text } from '../Text';

export interface INavItemProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  /** Final href — the caller resolves any locale/zone prefix. */
  href: string;
  icon?: IconProps['icon'];
  iconClassName?: string;
  /** Caller-computed active state; renders active styling + `aria-current`. */
  active?: boolean;
  /** Renders the "open in new tab" affordance and sets `target`/`rel`. */
  external?: boolean;
  /** Called on click — the app wires its drawer `closeMenu` here. */
  onNavigate?: () => void;
  /** Injected router link (e.g. `next/link`); defaults to a plain anchor. */
  component?: ElementType;
  /** Forwarded to the injected component — e.g. `next/link`'s `prefetch`. */
  prefetch?: boolean;
}

/**
 * Headless primary navigation link: borderless "ghost" row with icon + label
 * and an optional active state. Routing, i18n, and drawer concerns are
 * injected by the consuming app via `href`, `active`, `onNavigate`, and
 * `component`.
 */
export const NavItem = ({
  children,
  className,
  href,
  icon,
  iconClassName,
  active = false,
  external = false,
  onNavigate,
  component: Component = 'a',
  ...props
}: INavItemProps) => {
  return (
    <Component
      {...props}
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={classNames(
        'flex flex-row items-center justify-between transition-all px-4 py-3 rounded-lg',
        active
          ? 'bg-brand-primary [&_span]:font-bold [&_*]:!text-white'
          : 'hover:bg-surface [.light_&]:hover:bg-brand-primary-active active:bg-surface-sunken [&_span]:hover:font-bold [&_span]:active:font-bold [&_*]:active:!text-content-primary',
        className,
      )}
    >
      <div className="flex flex-row items-center gap-x-4">
        <Icon
          className={classNames(
            active ? 'text-white' : 'text-content-secondary',
            iconClassName,
          )}
          icon={icon}
        />
        <Text
          className={classNames(
            'font-bold',
            active ? '!text-white' : '!text-content-secondary',
          )}
        >
          {children}
        </Text>
      </div>
      {external ? (
        <Icon
          icon="material-symbols:open-in-new"
          className="text-content-disabled"
        />
      ) : null}
    </Component>
  );
};
