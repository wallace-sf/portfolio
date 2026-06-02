'use client';

import { FC } from 'react';

import { Divider } from '@repo/ui/View';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Header } from '../Header';
import { LanguageSelector } from './LanguageSelector';
import { MenuItem } from './MenuItem';
import { ThemeToggle } from './ThemeToggle';

interface SideNavigationProps {
  open: boolean;
  toggle: () => void;
}

export const SideNavigation: FC<SideNavigationProps> = ({ open, toggle }) => {
  const t = useTranslations('SideNavigation');

  return (
    <section className="fixed top-0 left-0 shadow-1 w-full xl:w-auto z-50">
      <Header open={open} toggle={toggle} />
      <nav
        id="side-navigation"
        className={classNames(
          'h-sidenav-mobile xl:h-sidenav-desktop left-0 w-full xl:w-60 xl:px-4 bg-surface-sunken flex flex-col border-0 duration-300 ease-linear xl:!translate-x-0 z-9999',
          open ? 'translate-x-0' : '-translate-x-full',
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
      </nav>
    </section>
  );
};
