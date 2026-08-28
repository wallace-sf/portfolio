'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { screens } from '@repo/tailwind-config/screens';
import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';

export interface SiteHeaderProps {
  /** Active locale, embedded in the logo link so it survives zone crossings. */
  locale: Locale;
  /** Resolved logo asset URL (each app owns its own asset). */
  logoSrc: string;
  /** Whether the mobile navigation is currently open. */
  isOpen: boolean;
  /** Toggles the mobile navigation. */
  onToggle: () => void;
}

export const SiteHeader: FC<SiteHeaderProps> = ({
  locale,
  logoSrc,
  isOpen,
  onToggle,
}) => {
  const t = useTranslations('Header');

  return (
    <header className="flex h-header-mobile w-full items-center justify-between bg-surface px-4 py-3 shadow-drop-md transition-all duration-300 ease-linear lg:h-header-desktop lg:w-60 lg:items-end lg:justify-center lg:bg-surface-sunken lg:p-0 lg:shadow-none">
      <NextLink href={`/${locale}`} aria-label={t('logo_alt')}>
        <picture>
          <source
            media={`(min-width: ${screens.lg})`}
            srcSet={logoSrc}
            width={99}
            height={66}
          />
          <img
            src={logoSrc}
            width={66}
            height={44}
            alt={t('logo_alt')}
            fetchPriority="high"
          />
        </picture>
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
