'use client';

import { FC } from 'react';

import { SiteHeader } from '@repo/layout/SiteHeader';
import { useLocale } from 'next-intl';

import logo from '~assets/images/logo.svg';

import type { Locale } from '@repo/core/shared';

interface HeaderProps {
  open: boolean;
  toggle: () => void;
}

export const Header: FC<HeaderProps> = ({ open, toggle }) => {
  const locale = useLocale() as Locale;

  return (
    <SiteHeader
      locale={locale}
      logoSrc={logo.src}
      isOpen={open}
      onToggle={toggle}
    />
  );
};
