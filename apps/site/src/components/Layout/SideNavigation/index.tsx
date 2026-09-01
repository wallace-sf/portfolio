'use client';

import { FC, useMemo } from 'react';

import type { Locale } from '@repo/core/shared';
import { screens } from '@repo/tailwind-config/screens';
import { Nav } from '@repo/ui/Control';
import { Divider } from '@repo/ui/View';
import classNames from 'classnames';
import { useLocale, useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useBoolean, useMediaQuery, useScrollLock } from 'usehooks-ts';

import { LanguageSelector } from '~/components/Layout/LanguageSelector';
import { ThemeToggle } from '~/components/Layout/ThemeToggle';
import { env } from '~/config/env';
import { useNavLink } from '~/hooks/useNavLink';
import { getResumeUrl } from '~/lib/resume';

import { SiteHeader } from '../SiteHeader';

import { SideNavProvider } from './context';

/**
 * The single side navigation: a fixed sidebar on `lg+`, an off-canvas drawer
 * below. Owns the drawer open state and the `closeMenu` context consumed by
 * the nested Theme / Language selectors; every route item resolves its href
 * and active state through the locale-aware `useNavLink`.
 */
export const SideNavigation: FC = () => {
  const t = useTranslations('SideNavigation');
  const locale = useLocale() as Locale;

  const isDesktop = useMediaQuery(`(min-width: ${screens.lg})`);
  const { value: open, toggle, setFalse: closeMenu } = useBoolean(false);
  const isOpen = !isDesktop && open;
  const context = useMemo(() => ({ closeMenu }), [closeMenu]);

  useScrollLock({ autoLock: isOpen });

  const home = useNavLink('/');
  const projects = useNavLink('/projects');
  const about = useNavLink('/about');
  const blog = useNavLink('/blog');

  return (
    <div className="fixed left-0 top-0 z-50 w-full shadow-1 lg:w-auto">
      <SiteHeader locale={locale} isOpen={isOpen} onToggle={toggle} />
      <SideNavProvider value={context}>
        <nav
          id="side-navigation"
          aria-label={t('mainNav')}
          className={classNames(
            'absolute right-0 top-full z-9999 flex h-sidenav-mobile w-full flex-col overflow-y-auto overscroll-y-contain border-0 bg-surface-sunken duration-300 ease-linear sm:w-[375px] lg:relative lg:top-auto lg:h-sidenav-desktop lg:w-60 lg:!translate-x-0 lg:px-4',
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
                href={blog.href}
                active={blog.active}
                onNavigate={closeMenu}
                icon="material-symbols:article"
              >
                {t('blog')}
              </Nav.Item>
            </li>
            <li>
              <Nav.Item
                component={NextLink}
                href={getResumeUrl(locale)}
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
      </SideNavProvider>
    </div>
  );
};
