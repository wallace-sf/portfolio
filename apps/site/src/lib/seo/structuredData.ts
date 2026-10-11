import type { Locale } from '@repo/core/shared';
import { buildBreadcrumbListJsonLd, type IBreadcrumbListNode } from '@repo/seo';

import { env } from '~/config/env';

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
  const sameAs = [env.linkedinUrl, env.githubUrl].filter((url): url is string =>
    Boolean(url),
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name,
        jobTitle: headline,
        image: photo.url,
        url: env.siteUrl,
        sameAs,
      },
      {
        '@type': 'WebSite',
        name: 'Wallace Ferreira',
        url: env.siteUrl,
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

export interface ProjectJsonLd {
  '@context': 'https://schema.org';
  '@graph': [CreativeWorkNode, IBreadcrumbListNode];
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
  const homeUrl = `${env.siteUrl}/${locale}`;
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
      buildBreadcrumbListJsonLd([
        { name: homeLabel, url: homeUrl },
        { name: projectsLabel, url: projectsUrl },
        { name: title, url: projectUrl },
      ]),
    ],
  };
}
