'use client';

import type { Locale } from '@repo/core/shared';
import { SiteHeader } from '@repo/layout/SiteHeader';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

export interface SideNavigationProps {
  locale: Locale;
  /** Whether the mobile drawer is open. */
  isOpen: boolean;
  /** Toggles the mobile drawer (wired to the header hamburger). */
  onToggle: () => void;
}

/**
 * Blog side navigation: the shared `SiteHeader` plus a nav region that is a
 * fixed sidebar on `lg+` and an off-canvas drawer below `lg`. The nav items
 * (hybrid: portfolio cross-zone + blog-local + social + theme/language) are
 * added in a follow-up — this is the shell.
 */
export const SideNavigation = ({
  locale,
  isOpen,
  onToggle,
}: SideNavigationProps) => {
  const t = useTranslations('SideNavigation');

  return (
    <div className="fixed left-0 top-0 z-50 w-full shadow-1 lg:w-auto">
      <SiteHeader locale={locale} isOpen={isOpen} onToggle={onToggle} />
      <nav
        id="blog-side-navigation"
        aria-label={t('mainNav')}
        className={classNames(
          'absolute right-0 top-full z-9999 flex h-sidenav-mobile w-full flex-col overflow-y-auto overscroll-y-contain bg-surface-sunken duration-300 ease-linear sm:w-[375px] lg:relative lg:top-auto lg:h-sidenav-desktop lg:w-60 lg:!translate-x-0 lg:px-4',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Nav items added in T-16 (hybrid nav). */}
      </nav>
    </div>
  );
};
