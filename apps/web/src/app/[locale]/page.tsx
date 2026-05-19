import { Suspense } from 'react';

import { applyDevSimulations } from '~/dev/simulate';
import { HeroSection } from '~features/home/HeroSection';
import {
  ProjectsSection,
  ProjectsSkeleton,
} from '~features/home/ProjectsSection';
import { HeroBannerSkeleton } from '~features/shared/HeroBanner/HeroBannerSkeleton';
import { ContactSection } from '~features/contact/ContactSection';

interface HomePageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
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
