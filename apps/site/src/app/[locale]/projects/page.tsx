import { GetPublishedProjects } from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DEFAULT_LOCALE } from '~/i18n/routing';
import { buildOgImageUrl } from '~/lib/og';
import { buildAlternates } from '~/lib/seo/alternates';
import { getServerContainer } from '~/lib/server/container';
import { HeroSection } from '~features/projects/HeroSection';
import { ProjectsSection } from '~features/projects/ProjectsSection';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface ProjectsPageProps {
  params?: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const locale = ((await params)?.locale ?? DEFAULT_LOCALE) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const title = t('ProjectsPage.title');
  const description = t('ProjectsPage.description');

  return {
    title,
    description,
    alternates: buildAlternates('/projects', locale),
    openGraph: {
      title,
      description,
      siteName: 'Wallace Ferreira',
      images: [
        {
          url: buildOgImageUrl({
            title,
            subtitle: t('ProjectsPage.ogSubtitle'),
            locale,
            page: t('ProjectsPage.ogPage'),
            jobTitle: t('OgCard.jobTitle'),
          }),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function Projects({ params }: ProjectsPageProps) {
  const locale = ((await params)?.locale ?? DEFAULT_LOCALE) as Locale;
  setRequestLocale(locale);

  const { projectRepository, skillRepository } = getServerContainer();
  const result = await new GetPublishedProjects(
    projectRepository,
    skillRepository,
  ).execute({ locale });

  const projects = result.isRight() ? result.value : [];

  return (
    <>
      <HeroSection locale={locale} />
      <ProjectsSection projects={projects} />
    </>
  );
}
