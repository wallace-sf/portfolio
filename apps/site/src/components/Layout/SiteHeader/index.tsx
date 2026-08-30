'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';

import { SiteLogo } from '../SiteLogo';

export interface SiteHeaderProps {
  /** Active locale — the logo links to the site home for this locale. */
  locale: Locale;
  /** Whether the mobile navigation is currently open. */
  isOpen: boolean;
  /** Toggles the mobile navigation. */
  onToggle: () => void;
}

export const SiteHeader: FC<SiteHeaderProps> = ({
  locale,
  isOpen,
  onToggle,
}) => {
  const t = useTranslations('Header');

  return (
    <header className="flex h-header-mobile w-full items-center justify-between bg-surface px-4 py-3 shadow-drop-md transition-all duration-300 ease-linear lg:h-header-desktop lg:w-60 lg:items-end lg:justify-center lg:bg-surface-sunken lg:p-0 lg:shadow-none">
      <NextLink href={`/${locale}`} aria-label={t('logo_alt')}>
        <SiteLogo className="h-11 w-[66px] lg:h-[66px] lg:w-[99px]" />
      </NextLink>
      <Button.Base
        className="flex size-10 items-center justify-center !rounded !bg-surface-raised !p-0 hover:!bg-surface lg:hidden"
        onClick={onToggle}
        aria-label={isOpen ? t('closeMenu') : t('openMenu')}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <Icon icon="ic:round-close" className="!text-content-secondary" />
        ) : (
          <Icon icon="ic:round-menu" className="!text-content-secondary" />
        )}
      </Button.Base>
    </header>
  );
};
