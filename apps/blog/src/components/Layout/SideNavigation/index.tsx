'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { SideNav } from '@repo/layout/SideNav';

export interface SideNavigationProps {
  locale: Locale;
}

/**
 * Blog side navigation — the shared `SideNav` shell with a skeleton item list.
 * The hybrid nav (portfolio cross-zone + blog-local + social + theme/language)
 * is filled in by task 16 of the shared-layout epic.
 */
export const SideNavigation: FC<SideNavigationProps> = ({ locale }) => (
  <SideNav locale={locale} primary={null} secondary={null} />
);
