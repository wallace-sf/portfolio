import { GetProfile } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import type { Metadata } from 'next';

import { applyDevSimulations } from '~/dev/simulate';
import { getServerContainer } from '~/lib/server/container';
import { CurriculumCTA } from '~features/about/CurriculumCTA';
import { ExperiencesSection } from '~features/about/ExperiencesSection';
import { HeroSection } from '~features/about/HeroSection';
import { ValuesSection } from '~features/about/ValuesSection';

export const revalidate = 86400;

interface AboutPageProps {
  params?: Promise<{ locale: string }>;
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const locale = (await params)?.locale ?? 'en-US';

  const title = locale.startsWith('pt')
    ? 'Sobre'
    : locale.startsWith('es')
      ? 'Sobre'
      : 'About';

  const { profileRepository } = getServerContainer();
  const profileResult = await new GetProfile(profileRepository).execute({
    locale: locale as Locale,
  });

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

export default async function About({ searchParams }: AboutPageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <div className="flex flex-col gap-y-20 pb-20">
      <HeroSection />
      <ValuesSection />
      <ExperiencesSection />
      <CurriculumCTA />
    </div>
  );
}
