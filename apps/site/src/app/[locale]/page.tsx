import { Suspense } from 'react';
import type { Metadata } from 'next';

import { applyDevSimulations } from '~/dev/simulate';
import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';
import { HeroSection } from '~features/home/HeroSection';
import {
  ProjectsSection,
  ProjectsSkeleton,
} from '~features/home/ProjectsSection';
import { HeroBannerSkeleton } from '~features/shared/HeroBanner/HeroBannerSkeleton';
import { ContactSection } from '~features/contact/ContactSection';

interface HomePageProps {
  params?: Promise<{ locale: string }>;
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

interface ProfileMeta {
  name: string;
  headline: string;
  bio: string;
  photo: { url: string; alt: string };
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const locale = (await params)?.locale ?? 'en-US';
  const baseUrl = await getInternalBaseUrl();

  const res = await fetch(`${baseUrl}/api/v1/profile?locale=${locale}`, {
    cache: 'no-store',
  }).catch(() => null);

  if (!res?.ok) return {};

  const body: ApiResponse<ProfileMeta> = await res.json();
  if (body.error) return {};

  const { name, headline, photo } = body.data;

  return {
    title: name,
    description: headline,
    openGraph: {
      title: name,
      description: headline,
      images: [{ url: photo.url, alt: photo.alt }],
    },
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
      <ContactSection />
    </>
  );
}
