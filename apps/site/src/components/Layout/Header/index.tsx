'use client';

import { FC } from 'react';

import { screens } from '@repo/tailwind-config/screens';
import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';

import logo from '~assets/images/logo.svg';

interface HeaderProps {
  open: boolean;
  toggle: () => void;
}

export const Header: FC<HeaderProps> = ({ open, toggle }) => {
  const t = useTranslations('Header');

  return (
    <header className="flex h-header-mobile w-full items-center justify-between bg-surface px-4 py-3 shadow-drop-md transition-all duration-300 ease-linear lg:h-header-desktop lg:w-60 lg:items-end lg:justify-center lg:bg-surface-sunken lg:p-0 lg:shadow-none">
      <NextLink href="/" aria-label={t('logo_alt')}>
        <picture>
          <source
            media={`(min-width: ${screens.lg})`}
            srcSet={logo.src}
            width={99}
            height={66}
          />
          <img
            src={logo.src}
            width={66}
            height={44}
            alt={t('logo_alt')}
            fetchPriority="high"
          />
        </picture>
      </NextLink>
      <Button.Base
        className="flex size-10 items-center justify-center !rounded !bg-surface-raised !p-0 hover:!bg-surface lg:hidden"
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
