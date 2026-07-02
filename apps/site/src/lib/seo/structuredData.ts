import type { Locale } from '@repo/core/shared';

import { SITE_URL } from '~/lib/og';

interface BuildPersonJsonLdParams {
  name: string;
  headline: string;
  photo: { url: string; alt: string };
}

interface PersonNode {
  '@type': 'Person';
  name: string;
  jobTitle: string;
  image: string;
  url: string;
  sameAs: string[];
}

interface WebSiteNode {
  '@type': 'WebSite';
  name: string;
  url: string;
}

export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@graph': [PersonNode, WebSiteNode];
}

export function buildPersonJsonLd({
  name,
  headline,
  photo,
}: BuildPersonJsonLdParams): PersonJsonLd {
  const sameAs = [
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_GITHUB_URL,
  ].filter((url): url is string => Boolean(url));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name,
        jobTitle: headline,
        image: photo.url,
        url: SITE_URL,
        sameAs,
      },
      {
        '@type': 'WebSite',
        name: 'Wallace Ferreira',
        url: SITE_URL,
      },
    ],
  };
}

interface BuildProjectJsonLdParams {
  title: string;
  caption: string;
  coverImage: { url: string };
  slug: string;
  locale: Locale;
  homeLabel: string;
  projectsLabel: string;
}

interface CreativeWorkNode {
  '@type': 'CreativeWork';
  name: string;
  description: string;
  image: string;
  url: string;
}

interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

interface BreadcrumbListNode {
  '@type': 'BreadcrumbList';
  itemListElement: [BreadcrumbItem, BreadcrumbItem, BreadcrumbItem];
}

export interface ProjectJsonLd {
  '@context': 'https://schema.org';
  '@graph': [CreativeWorkNode, BreadcrumbListNode];
}

export function buildProjectJsonLd({
  title,
  caption,
  coverImage,
  slug,
  locale,
  homeLabel,
  projectsLabel,
}: BuildProjectJsonLdParams): ProjectJsonLd {
  const homeUrl = `${SITE_URL}/${locale}`;
  const projectsUrl = `${homeUrl}/projects`;
  const projectUrl = `${projectsUrl}/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: title,
        description: caption,
        image: coverImage.url,
        url: projectUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: homeLabel,
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: projectsLabel,
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: projectUrl,
          },
        ],
      },
    ],
  };
}
