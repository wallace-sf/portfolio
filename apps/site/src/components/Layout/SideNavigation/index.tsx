'use client';

import { FC, useCallback } from 'react';

import { Divider } from '@repo/ui/View';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useBoolean, useEventListener, useScrollLock } from 'usehooks-ts';

import { useThrottle } from '~hooks';
import { BREAKPOINTS_NUMBERS } from '~utils';

import { Header } from '../Header';
import { MenuItem } from '../MenuItem';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';

export const SideNavigation: FC = () => {
  const t = useTranslations('SideNavigation');
  const { lock, unlock } = useScrollLock({ autoLock: false });
  const { value, setTrue, toggle } = useBoolean(false);

  const throttle = useThrottle(() => {
    setTrue();
  }, 500);

  useEventListener('resize', () => {
    if (window.innerWidth < BREAKPOINTS_NUMBERS.lg) throttle();
  });

  return (
    <nav
      id="side-navigation"
      className={classNames(
        'w-full xl:w-60 h-screen fixed top-0 z-50 left-0 xl:px-4 bg-surface-sunken flex flex-col border-0 shadow-1 box-content',
      )}
    >
      <Header open={value} toggle={toggle} />
      <main
        className={classNames(
          'transition-all duration-300 ease-linear h-full xl:!translate-x-0',
          value ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <ul className="flex flex-col gap-y-3 px-6 pt-10 xl:pt-15 xl:px-0">
          <MenuItem.Item1 href="/" icon="material-symbols:home">
            {t('home')}
          </MenuItem.Item1>
          <MenuItem.Item1
            href="/projects"
            icon="material-symbols:deployed-code"
          >
            {t('projects')}
          </MenuItem.Item1>
          <MenuItem.Item1 href="/about" icon="material-symbols:person">
            {t('about')}
          </MenuItem.Item1>
          <MenuItem.Item1
            href={process.env.NEXT_PUBLIC_RESUME_URL}
            icon="material-symbols:description"
            newTab
          >
            {t('resume')}
          </MenuItem.Item1>
        </ul>
        <Divider className="mx-6 xl:mx-0" />
        <ul className="flex flex-col gap-y-3 px-6 xl:pb-8 xl:px-0 xl:justify-end">
          <MenuItem.Item2.Link
            href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
            icon="devicon:linkedin"
            newTab
          >
            {t('linkedin')}
          </MenuItem.Item2.Link>
          <MenuItem.Item2.Link
            href={process.env.NEXT_PUBLIC_GITHUB_URL}
            icon="mdi:github"
            iconClassName="text-white"
            newTab
          >
            {t('github')}
          </MenuItem.Item2.Link>
          <MenuItem.Item2.Link
            href="/feed.xml"
            icon="mdi:rss"
            iconClassName="text-white"
            newTab
          >
            {t('rss')}
          </MenuItem.Item2.Link>
          <ThemeToggle />
          <LanguageSelector />
        </ul>
      </main>
    </nav>
  );
};
