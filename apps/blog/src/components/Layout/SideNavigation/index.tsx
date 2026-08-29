'use client';

import { FC } from 'react';

import type { Locale } from '@repo/core/shared';
import { buildCrossZoneHref } from '@repo/layout';
import { LanguageSelector } from '@repo/layout/LanguageSelector';
import { SideNav, useNavLink } from '@repo/layout/SideNav';
import { ThemeToggle } from '@repo/layout/ThemeToggle';
import { Nav } from '@repo/ui/Control';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';

import { env } from '~/config/env';
import { getResumeUrl } from '~/lib/resume';

export interface SideNavigationProps {
  locale: Locale;
}

/**
 * Blog side navigation — hybrid model on the shared `SideNav` shell:
 * portfolio links cross back to the `site` zone (plain anchors, never active,
 * since the reader is in the blog zone), the Blog Home link is blog-local with
 * its own active state, and the secondary group holds social links plus the
 * theme and language controls.
 */
export const SideNavigation: FC<SideNavigationProps> = ({ locale }) => {
  const t = useTranslations('SideNavigation');

  const blogHome = useNavLink('/');

  return (
    <SideNav
      locale={locale}
      primary={({ closeMenu }) => (
        <>
          <li>
            <Nav.Item
              href={buildCrossZoneHref('site', locale, '/')}
              onNavigate={closeMenu}
              icon="material-symbols:home"
            >
              {t('home')}
            </Nav.Item>
          </li>
          <li>
            <Nav.Item
              href={buildCrossZoneHref('site', locale, '/projects')}
              onNavigate={closeMenu}
              icon="material-symbols:deployed-code"
            >
              {t('projects')}
            </Nav.Item>
          </li>
          <li>
            <Nav.Item
              href={buildCrossZoneHref('site', locale, '/about')}
              onNavigate={closeMenu}
              icon="material-symbols:person"
            >
              {t('about')}
            </Nav.Item>
          </li>
          <li>
            <Nav.Item
              href={getResumeUrl(locale)}
              onNavigate={closeMenu}
              external
              icon="material-symbols:description"
            >
              {t('resume')}
            </Nav.Item>
          </li>
          <li>
            <Nav.Item
              component={NextLink}
              href={blogHome.href}
              active={blogHome.active}
              onNavigate={closeMenu}
              icon="material-symbols:article"
            >
              {t('blogHome')}
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
              href={`/${locale}/rss.xml`}
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
