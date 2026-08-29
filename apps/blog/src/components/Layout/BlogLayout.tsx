'use client';

import { type ReactNode } from 'react';

import type { Locale } from '@repo/core/shared';
import { buildCrossZoneHref } from '@repo/layout';
import { SiteFooter } from '@repo/layout/SiteFooter';
import { useTranslations } from 'next-intl';

import { SideNavigation } from './SideNavigation';

export interface BlogLayoutProps {
  children: ReactNode;
  locale: Locale;
}

/**
 * Chirpy-style blog shell: the shared side navigation (persistent sidebar on
 * `lg+` / off-canvas drawer below) and a single centred content column.
 */
export const BlogLayout = ({ children, locale }: BlogLayoutProps) => {
  const t = useTranslations('Footer');

  return (
    <>
      <SideNavigation locale={locale} />
      <div className="ml-0 mt-header-mobile flex min-h-screen flex-col lg:ml-60 lg:mt-0">
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8 lg:py-12">
          {children}
        </main>
        <SiteFooter>
          <div className="mx-4 flex flex-col items-center gap-y-2 text-center text-body-sm text-content-secondary xl:mx-8">
            <p>{t('copyright', { year: new Date().getFullYear() })}</p>
            <a
              href={buildCrossZoneHref('site', locale)}
              className="font-bold text-content-primary hover:underline"
            >
              {t('backToPortfolio')}
            </a>
          </div>
        </SiteFooter>
      </div>
    </>
  );
};
