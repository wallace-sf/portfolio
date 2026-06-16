'use client';

import { FC } from 'react';

import { Divider } from '@repo/ui/View';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useBoolean, useScrollLock } from 'usehooks-ts';

import { useBreakpoint } from '~hooks';

import { Header } from '../Header';
import { LanguageSelector } from './LanguageSelector';
import { MenuItem } from './MenuItem';
import { ThemeToggle } from './ThemeToggle';

export const SideNavigation: FC = () => {
  const t = useTranslations('SideNavigation');
  const isDesktop = useBreakpoint('lg');
  const { value: open, toggle } = useBoolean(false);
  const isOpen = !isDesktop && open;

  useScrollLock({ autoLock: isOpen });

  return (
    <div className="fixed top-0 left-0 shadow-1 w-full lg:w-auto z-50">
      <Header open={isOpen} toggle={toggle} />
      <nav
        id="side-navigation"
        aria-label={t('mainNav')}
        className={classNames(
          'absolute top-full lg:relative lg:top-auto h-sidenav-mobile lg:h-sidenav-desktop right-0 w-full sm:w-[375px] lg:w-60 lg:px-4 bg-surface-sunken flex flex-col overflow-y-auto overscroll-y-contain border-0 duration-300 ease-linear lg:!translate-x-0 z-9999',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <ul className="flex flex-col gap-y-3 px-6 pt-10 lg:pt-15 lg:px-0">
          <li>
            <MenuItem.Item1 href="/" icon="material-symbols:home">
              {t('home')}
            </MenuItem.Item1>
          </li>
          <li>
            <MenuItem.Item1
              href="/projects"
              icon="material-symbols:deployed-code"
            >
              {t('projects')}
            </MenuItem.Item1>
          </li>
          <li>
            <MenuItem.Item1 href="/about" icon="material-symbols:person">
              {t('about')}
            </MenuItem.Item1>
          </li>
          <li>
            <MenuItem.Item1
              href={process.env.NEXT_PUBLIC_RESUME_URL}
              icon="material-symbols:description"
              newTab
            >
              {t('resume')}
            </MenuItem.Item1>
          </li>
        </ul>
        <Divider className="mx-6 lg:mx-0" />
        <ul className="flex flex-col gap-y-3 px-6 pb-8 lg:px-0 lg:justify-end">
          <li>
            <MenuItem.Item2.Link
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
              icon="devicon:linkedin"
              newTab
            >
              {t('linkedin')}
            </MenuItem.Item2.Link>
          </li>
          <li>
            <MenuItem.Item2.Link
              href={process.env.NEXT_PUBLIC_GITHUB_URL}
              icon="mdi:github"
              iconClassName="text-white"
              newTab
            >
              {t('github')}
            </MenuItem.Item2.Link>
          </li>
          <li>
            <MenuItem.Item2.Link
              href="/feed.xml"
              icon="mdi:rss"
              iconClassName="text-white"
              newTab
            >
              {t('rss')}
            </MenuItem.Item2.Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <LanguageSelector />
          </li>
        </ul>
      </nav>
    </div>
  );
};
