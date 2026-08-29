'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';

import { buildCrossZoneHref } from '~/buildCrossZoneHref';
import { SiteLogo } from '~/SiteLogo';

export interface SiteHeaderProps {
  /**
   * Active locale. The logo always links back to the portfolio (`site`) home
   * for that locale — a cross-zone link when rendered in the `blog` zone,
   * resolved here via `buildCrossZoneHref` so this component stays the single
   * source of truth for the brand mark and its destination.
   */
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
      {/* Plain anchor: the logo always points at the portfolio root, which
          is cross-zone (and must escape the basePath) when rendered in the
          blog zone. */}
      <a href={buildCrossZoneHref('site', locale)} aria-label={t('logo_alt')}>
        <SiteLogo className="h-11 w-[66px] lg:h-[66px] lg:w-[99px]" />
      </a>
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
