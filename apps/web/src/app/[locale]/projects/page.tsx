import { Suspense } from 'react';

import { applyDevSimulations } from '~/dev/simulate';
import { HeroSection } from '~features/projects/HeroSection';
import { ProjectsSection } from '~features/projects/ProjectsSection';
import { ProjectsSkeleton } from '~features/home/ProjectsSection';
import { HeroBannerSkeleton } from '~features/shared/HeroBanner/HeroBannerSkeleton';

interface ProjectsPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function Projects({ searchParams }: ProjectsPageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <Suspense fallback={<HeroBannerSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
    </>
  );
}
