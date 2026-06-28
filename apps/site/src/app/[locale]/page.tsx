import { GetFeaturedProjects, GetProfile } from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DEFAULT_LOCALE } from '~/i18n/routing';
import { buildOgImageUrl } from '~/lib/og';
import { getServerContainer } from '~/lib/server/container';
import { HeroSection } from '~features/home/HeroSection';
import { ProjectsSection } from '~features/home/ProjectsSection';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface HomePageProps {
  params?: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const locale = ((await params)?.locale ?? DEFAULT_LOCALE) as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const profileResult = await new GetProfile(
    getServerContainer().profileRepository,
  ).execute({ locale });

  if (profileResult.isLeft())
    return { title: { absolute: `${t('HomePage.title')} | Wallace Ferreira` } };

  const { name, headline } = profileResult.value;

  return {
    title: { absolute: `${t('HomePage.title')} | Wallace Ferreira` },
    description: headline,
    openGraph: {
      title: name,
      description: headline,
      siteName: 'Wallace Ferreira',
      images: [
        {
          url: buildOgImageUrl({
            title: name,
            subtitle: t('HomePage.ogSubtitle'),
            locale,
            page: t('HomePage.ogPage'),
            jobTitle: t('OgCard.jobTitle'),
          }),
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
  };
}

export default async function Home({ params }: HomePageProps) {
  const locale = ((await params)?.locale ?? DEFAULT_LOCALE) as Locale;
  setRequestLocale(locale);

  const { profileRepository, projectRepository, skillRepository } =
    getServerContainer();

  const [profileResult, projectsResult] = await Promise.all([
    new GetProfile(profileRepository).execute({ locale }),
    new GetFeaturedProjects(projectRepository, skillRepository).execute({
      locale,
    }),
  ]);

  const profile = profileResult.isRight() ? profileResult.value : null;
  const projects = projectsResult.isRight() ? projectsResult.value : [];

  return (
    <>
      <HeroSection locale={locale} profile={profile} />
      <ProjectsSection locale={locale} projects={projects} />
    </>
  );
}
