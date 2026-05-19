import { Suspense } from 'react';

import { applyDevSimulations } from '~/dev/simulate';
import {
  ExperiencesSection,
  ExperiencesSkeleton,
} from '~features/about/ExperiencesSection';
import { HeroSection } from '~features/about/HeroSection';
import { ValuesSection, ValuesSkeleton } from '~features/about/ValuesSection';
import { HeroBannerSkeleton } from '~features/shared/HeroBanner/HeroBannerSkeleton';

interface AboutPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
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
