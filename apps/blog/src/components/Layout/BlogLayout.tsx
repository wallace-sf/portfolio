'use client';

import { type ReactNode } from 'react';

import type { Locale } from '@repo/core/shared';
import { buildCrossZoneHref } from '@repo/layout';
import { SiteFooter } from '@repo/layout/SiteFooter';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useBoolean, useScrollLock } from 'usehooks-ts';

import { SideNavigation } from './SideNavigation';

export interface BlogLayoutProps {
  children: ReactNode;
  locale: Locale;
}

/**
 * Chirpy-style blog shell: a persistent left sidebar on `lg+` / off-canvas
 * drawer below, and a single centred content column. Owns the drawer open
 * state and locks body scroll while it is open.
 */
export const BlogLayout = ({ children, locale }: BlogLayoutProps) => {
  const t = useTranslations('Footer');
  const { value: drawerOpen, toggle: toggleDrawer } = useBoolean(false);

  useScrollLock({ autoLock: drawerOpen });

  return (
    <>
      <SideNavigation
        locale={locale}
        isOpen={drawerOpen}
        onToggle={toggleDrawer}
      />
      <div className="ml-0 mt-header-mobile flex min-h-screen flex-col lg:ml-60 lg:mt-0">
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8 lg:py-12">
          {children}
        </main>
        <SiteFooter>
          <div className="mx-4 flex flex-col items-center gap-y-2 text-center text-body-sm text-content-secondary xl:mx-8">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            <NextLink
              href={buildCrossZoneHref('site', locale)}
              className="font-bold text-content-primary hover:underline"
            >
              {t('backToPortfolio')}
            </NextLink>
          </div>
        </SiteFooter>
      </div>
    </>
  );
};
