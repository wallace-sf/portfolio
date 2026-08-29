'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { buildCrossZoneHref } from '@repo/layout';
import { LanguageSelector } from '@repo/layout/LanguageSelector';
import { SideNav, useNavLink } from '@repo/layout/SideNav';
import { ThemeToggle } from '@repo/layout/ThemeToggle';
import { Nav } from '@repo/ui/Control';
import { useLocale, useTranslations } from 'next-intl';
import NextLink from 'next/link';

import { env } from '~/config/env';
import { getResumeUrl } from '~/lib/resume';

export const SideNavigation: FC = () => {
  const t = useTranslations('SideNavigation');
  const locale = useLocale();

  const home = useNavLink('/');
  const projects = useNavLink('/projects');
  const about = useNavLink('/about');

  return (
    <SideNav
      locale={locale as Locale}
      primary={({ closeMenu }) => (
        <>
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
              href={getResumeUrl(locale as Parameters<typeof getResumeUrl>[0])}
              onNavigate={closeMenu}
              external
              icon="material-symbols:description"
            >
              {t('resume')}
            </Nav.Item>
          </li>
        </>
      )}
      secondary={({ closeMenu }) => (
        <>
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
        </>
      )}
    />
  );
};
