'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { SiteHeader } from '@repo/layout/SiteHeader';
import { useLocale } from 'next-intl';

interface HeaderProps {
  open: boolean;
  toggle: () => void;
}

export const Header: FC<HeaderProps> = ({ open, toggle }) => {
  const locale = useLocale() as Locale;

  return <SiteHeader locale={locale} isOpen={open} onToggle={toggle} />;
};
