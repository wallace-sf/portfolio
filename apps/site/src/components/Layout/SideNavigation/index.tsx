'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { buildCrossZoneHref } from '@repo/layout';
import { Nav } from '@repo/ui/Control';
import { Divider } from '@repo/ui/View';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useBoolean, useScrollLock } from 'usehooks-ts';

import { env } from '~/config/env';
import { getResumeUrl } from '~/lib/resume';
import { useBreakpoint, useNavLink } from '~hooks';

import { Header } from '../Header';
import { SideNavigationProvider } from './context';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';

export const SideNavigation: FC = () => {
  const t = useTranslations('SideNavigation');
  const locale = useLocale();
  const isDesktop = useBreakpoint('lg');
  const { value: open, toggle, setFalse: closeMenu } = useBoolean(false);
  const isOpen = !isDesktop && open;

  const home = useNavLink('/');
  const projects = useNavLink('/projects');
  const about = useNavLink('/about');

  useScrollLock({ autoLock: isOpen });

  return (
    <div className="fixed left-0 top-0 z-50 w-full shadow-1 lg:w-auto">
      <Header open={isOpen} toggle={toggle} />
      <SideNavigationProvider value={{ closeMenu }}>
        <nav
          id="side-navigation"
          aria-label={t('mainNav')}
          className={classNames(
            'absolute top-full lg:relative lg:top-auto h-sidenav-mobile lg:h-sidenav-desktop right-0 w-full sm:w-[375px] lg:w-60 lg:px-4 bg-surface-sunken flex flex-col overflow-y-auto overscroll-y-contain border-0 duration-300 ease-linear lg:!translate-x-0 z-9999',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <ul className="flex flex-col gap-y-3 px-6 pt-10 lg:px-0 lg:pt-15">
            <li>
              <Nav.Item
                component={NextLink}
                href={home.href}
                active={home.active}
                onNavigate={closeMenu}
                icon="material-symbols:home"
              >
                {t('home')}
              </Nav.Item>
            </li>
            <li>
              <Nav.Item
                component={NextLink}
                href={projects.href}
                active={projects.active}
                onNavigate={closeMenu}
                icon="material-symbols:deployed-code"
              >
                {t('projects')}
              </Nav.Item>
            </li>
            <li>
              <Nav.Item
                component={NextLink}
                href={about.href}
                active={about.active}
                onNavigate={closeMenu}
                icon="material-symbols:person"
              >
                {t('about')}
              </Nav.Item>
            </li>
            <li>
              <Nav.Item
                component={NextLink}
                href={buildCrossZoneHref('blog', locale as Locale)}
                onNavigate={closeMenu}
                prefetch={false}
                icon="material-symbols:article"
              >
                {t('blog')}
              </Nav.Item>
            </li>
            <li>
              <Nav.Item
                component={NextLink}
                href={getResumeUrl(
                  locale as Parameters<typeof getResumeUrl>[0],
                )}
                onNavigate={closeMenu}
                external
                icon="material-symbols:description"
              >
                {t('resume')}
              </Nav.Item>
            </li>
          </ul>
          <Divider className="mx-6 lg:mx-0" />
          <ul className="flex flex-col gap-y-3 px-6 pb-8 lg:justify-end lg:px-0">
            <li>
              <Nav.Link
                component={NextLink}
                href={env.linkedinUrl}
                onNavigate={closeMenu}
                external
                icon="devicon:linkedin"
              >
                {t('linkedin')}
              </Nav.Link>
            </li>
            <li>
              <Nav.Link
                component={NextLink}
                href={env.githubUrl}
                onNavigate={closeMenu}
                external
                icon="mdi:github"
                iconClassName="text-content-primary"
              >
                {t('github')}
              </Nav.Link>
            </li>
            <li>
              <Nav.Link
                component={NextLink}
                href={`/${locale}/feed.xml`}
                onNavigate={closeMenu}
                external
                icon="mdi:rss"
                iconClassName="text-content-primary"
              >
                {t('rss')}
              </Nav.Link>
            </li>
            <li>
              <ThemeToggle />
            </li>
            <li>
              <LanguageSelector />
            </li>
          </ul>
        </nav>
      </SideNavigationProvider>
    </div>
  );
};
