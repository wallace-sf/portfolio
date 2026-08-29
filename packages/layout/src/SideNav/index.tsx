'use client';

import { type ReactNode, useMemo } from 'react';

import type { Locale } from '@repo/core/shared';
import { screens } from '@repo/tailwind-config/screens';
import { Divider } from '@repo/ui/View';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useBoolean, useMediaQuery, useScrollLock } from 'usehooks-ts';

import { SiteHeader } from '~/SiteHeader';

import { SideNavProvider } from './context';

export { SideNavProvider, useSideNav, type ISideNavContext } from './context';
export { useNavLink, type INavLinkState } from './useNavLink';

export interface SideNavProps {
  /** Active locale — passed through to the shared `SiteHeader`. */
  locale: Locale;
  /** Primary nav group (top `<ul>`). */
  primary: ReactNode;
  /** Secondary nav group (bottom `<ul>`, below the divider). */
  secondary: ReactNode;
}

/**
 * The side-navigation shell shared across the `site` and `blog` zones: the
 * fixed wrapper, the `SiteHeader`, and the `<nav>` region that is a fixed
 * sidebar on `lg+` and an off-canvas drawer below. Owns the drawer open state
 * and the `closeMenu` context; the caller supplies the nav item lists.
 */
export const SideNav = ({ locale, primary, secondary }: SideNavProps) => {
  const t = useTranslations('SideNavigation');
  const isDesktop = useMediaQuery(`(min-width: ${screens.lg})`);
  const { value: open, toggle, setFalse: closeMenu } = useBoolean(false);
  const isOpen = !isDesktop && open;
  const context = useMemo(() => ({ closeMenu }), [closeMenu]);

  useScrollLock({ autoLock: isOpen });

  return (
    <div className="fixed left-0 top-0 z-50 w-full shadow-1 lg:w-auto">
      <SiteHeader locale={locale} isOpen={isOpen} onToggle={toggle} />
      <SideNavProvider value={context}>
        <nav
          id="side-navigation"
          aria-label={t('mainNav')}
          className={classNames(
            'absolute right-0 top-full z-9999 flex h-sidenav-mobile w-full flex-col overflow-y-auto overscroll-y-contain border-0 bg-surface-sunken duration-300 ease-linear sm:w-[375px] lg:relative lg:top-auto lg:h-sidenav-desktop lg:w-60 lg:!translate-x-0 lg:px-4',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <ul className="flex flex-col gap-y-3 px-6 pt-10 lg:px-0 lg:pt-15">
            {primary}
          </ul>
          <Divider className="mx-6 lg:mx-0" />
          <ul className="flex flex-col gap-y-3 px-6 pb-8 lg:justify-end lg:px-0">
            {secondary}
          </ul>
        </nav>
      </SideNavProvider>
    </div>
  );
};
