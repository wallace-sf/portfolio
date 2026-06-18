import { GetProfile } from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import { Divider } from '@repo/ui/View';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DEFAULT_LOCALE } from '~/i18n/routing';
import { getServerContainer } from '~/lib/server/container';
import { CurriculumCTA } from '~features/about/CurriculumCTA';
import { ExperiencesSection } from '~features/about/ExperiencesSection';
import { HeroSection } from '~features/about/HeroSection';
import { ValuesSection } from '~features/about/ValuesSection';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface AboutPageProps {
  params?: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const locale = ((await params)?.locale ?? DEFAULT_LOCALE) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const title = t('AboutPage.title');

  const profileResult = await new GetProfile(
    getServerContainer().profileRepository,
  ).execute({ locale });

  if (profileResult.isLeft()) return { title };

  const { bio, photo } = profileResult.value;

  return {
    title,
    description: bio,
    openGraph: {
      title,
      description: bio,
      images: [{ url: photo.url, alt: photo.alt }],
    },
  };
}

export default async function About({ params }: AboutPageProps) {
  const locale = ((await params)?.locale ?? DEFAULT_LOCALE) as Locale;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col pb-10 xl:pb-16 2xl:pb-20">
      <HeroSection locale={locale} />
      <ValuesSection locale={locale} />
      <Divider />
      <ExperiencesSection locale={locale} />
      <CurriculumCTA locale={locale} />
    </div>
  );
}
