import { GetProfile } from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';
import { CurriculumCTA } from '~features/about/CurriculumCTA';
import { ExperiencesSection } from '~features/about/ExperiencesSection';
import { HeroSection } from '~features/about/HeroSection';
import { ValuesSection } from '~features/about/ValuesSection';

export const revalidate = 86400;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface AboutPageProps {
  params?: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const locale = ((await params)?.locale ?? 'en-US') as Locale;
  setRequestLocale(locale);

  const title =
    locale.startsWith('pt') || locale.startsWith('es') ? 'Sobre' : 'About';

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
  const locale = ((await params)?.locale ?? 'en-US') as Locale;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-y-20 pb-20">
      <HeroSection locale={locale} />
      <ValuesSection locale={locale} />
      <ExperiencesSection locale={locale} />
      <CurriculumCTA locale={locale} />
    </div>
  );
}
