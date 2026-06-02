'use client';

import { FC } from 'react';

import { Button } from '@repo/ui/Control';
import { Icon } from '@repo/ui/Imagery';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import logoDesktop from '~assets/images/logo-desktop.svg';
import logoMobile from '~assets/images/logo-mobile.svg';

interface HeaderProps {
  open: boolean;
  toggle: () => void;
}

export const Header: FC<HeaderProps> = ({ open, toggle }) => {
  const t = useTranslations('Header');

  return (
    <header className="w-full xl:w-60 flex items-center xl:items-end justify-between xl:justify-center bg-surface xl:bg-surface-sunken px-4 py-3 xl:px-0 xl:py-0 transition-all duration-300 ease-linear h-header-mobile xl:h-header-desktop">
      <Image
        src={logoDesktop}
        width={179}
        height={66}
        alt={t('logo_alt')}
        className="hidden xl:block"
        priority
      />
      <Image
        src={logoMobile}
        width={120}
        height={44}
        alt={t('logo_alt')}
        className="block xl:hidden"
        priority
      />
      <Button.Base
        className="flex items-center justify-center h-10 w-10 !bg-surface-raised hover:!bg-surface !rounded !p-0 xl:hidden"
        onClick={toggle}
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
