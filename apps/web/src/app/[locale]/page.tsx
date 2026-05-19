import { Suspense } from 'react';

import { applyDevSimulations } from '~/dev/simulate';
import { ContactSection } from '~features/contact/ContactSection';
import { HeroSection } from '~features/home/HeroSection';
import { ProjectsSection } from '~features/home/ProjectsSection';

interface HomePageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

function HeroSkeleton() {
  return (
    <section className="animate-pulse flex flex-col bg-surface gap-y-6 xl:flex xl:flex-row xl:rounded-xl xl:h-106">
      <section className="flex flex-col px-6 pb-6 xl:py-20 xl:pl-20 xl:w-1/2 gap-y-4">
        <div className="h-8 w-48 bg-gray-700 rounded" />
        <div className="h-8 w-64 bg-gray-700 rounded" />
        <div className="flex flex-col gap-y-2 pt-4">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-700 rounded w-4/6" />
        </div>
      </section>
      <section className="xl:order-1 xl:w-1/2 bg-gray-700 xl:rounded-r-xl min-h-50" />
    </section>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full flex justify-start mx-4 my-6 xl:mx-auto xl:max-w-237.5">
        <div className="h-8 w-32 bg-gray-700 rounded" />
      </div>
      <ul className="mx-auto grid max-w-237.5 gap-4 md:grid-cols-2 xl:gap-6 pb-8 xl:pb-20">
        {(['card-1', 'card-2', 'card-3', 'card-4'] as const).map((key) => (
          <li key={key} className="bg-surface p-3 rounded-5">
            <div className="h-45 xl:h-61 bg-gray-700 rounded-lg mb-4" />
            <div className="h-5 w-3/4 bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-700 rounded mb-1" />
            <div className="h-4 w-5/6 bg-gray-700 rounded mb-5" />
            <div className="h-10 bg-gray-700 rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
      <ContactSection />
    </>
  );
}
