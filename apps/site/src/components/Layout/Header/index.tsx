'use client';

import { FC } from 'react';

import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';

import { screens } from '@repo/tailwind-config/screens';
import logoDesktop from '~assets/images/logo-desktop.svg';
import logoMobile from '~assets/images/logo-mobile.svg';

interface HeaderProps {
  open: boolean;
  toggle: () => void;
}

export const Header: FC<HeaderProps> = ({ open, toggle }) => {
  const t = useTranslations('Header');

  return (
    <header className="w-full lg:w-60 flex items-center lg:items-end justify-between lg:justify-center bg-surface lg:bg-surface-sunken px-4 py-3 lg:px-0 lg:py-0 transition-all duration-300 ease-linear h-header-mobile lg:h-header-desktop shadow-drop-md lg:shadow-none">
      <NextLink href="/" aria-label={t('logo_alt')}>
        <picture>
          <source
            media={`(min-width: ${screens.lg})`}
            srcSet={logoDesktop.src}
            width={179}
            height={66}
          />
          <img
            src={logoMobile.src}
            width={120}
            height={44}
            alt={t('logo_alt')}
            fetchPriority="high"
          />
        </picture>
      </NextLink>
      <Button.Base
        className="flex items-center justify-center h-10 w-10 !bg-surface-raised hover:!bg-surface !rounded !p-0 lg:hidden"
        onClick={toggle}
        aria-label={open ? t('closeMenu') : t('openMenu')}
        aria-expanded={open}
      >
        {open ? (
          <Icon icon="ic:round-close" className="!text-content-secondary" />
        ) : (
          <Icon icon="ic:round-menu" className="!text-content-secondary" />
        )}
      </Button.Base>
    </header>
  );
};
