import { GetFeaturedProjects, GetProfile } from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DEFAULT_LOCALE } from '~/i18n/routing';
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

  if (profileResult.isLeft()) return { title: t('HomePage.title') };

  const { name, headline, photo } = profileResult.value;

  return {
    title: t('HomePage.title'),
    description: headline,
    openGraph: {
      title: name,
      description: headline,
      images: [{ url: photo.url, alt: photo.alt }],
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
