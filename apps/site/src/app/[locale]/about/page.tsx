import { Suspense } from 'react';
import type { Metadata } from 'next';

import { applyDevSimulations } from '~/dev/simulate';
import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';
import {
  ExperiencesSection,
  ExperiencesSkeleton,
} from '~features/about/ExperiencesSection';
import { HeroSection } from '~features/about/HeroSection';
import { ValuesSection, ValuesSkeleton } from '~features/about/ValuesSection';
import { HeroBannerSkeleton } from '~features/shared/HeroBanner/HeroBannerSkeleton';

interface AboutPageProps {
  params?: Promise<{ locale: string }>;
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

interface ProfileMeta {
  name: string;
  bio: string;
  photo: { url: string; alt: string };
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const locale = (await params)?.locale ?? 'en-US';
  const baseUrl = await getInternalBaseUrl();

  const res = await fetch(`${baseUrl}/api/v1/profile?locale=${locale}`, {
    cache: 'no-store',
  }).catch(() => null);

  const title = locale.startsWith('pt')
    ? 'Sobre'
    : locale.startsWith('es')
      ? 'Sobre'
      : 'About';

  if (!res?.ok) return { title };

  const body: ApiResponse<ProfileMeta> = await res.json();
  if (body.error) return { title };

  const { bio, photo } = body.data;

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
    <>
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<ValuesSkeleton />}>
        <ValuesSection />
      </Suspense>
      <Suspense fallback={<ExperiencesSkeleton />}>
        <ExperiencesSection />
      </Suspense>
    </>
  );
}
