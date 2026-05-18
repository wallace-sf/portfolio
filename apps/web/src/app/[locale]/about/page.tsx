import { Suspense } from 'react';

import { applyDevSimulations } from '~/dev/simulate';
import { ExperiencesSection } from '~features/about/ExperiencesSection';
import { HeroSection } from '~features/about/HeroSection';
import { ValuesSection } from '~features/about/ValuesSection';

interface AboutPageProps {
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

function ValuesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-700 rounded mx-4 my-6 xl:mx-auto xl:max-w-237.5" />
      <ul className="flex flex-row gap-x-4 mx-4 xl:mx-auto xl:max-w-237.5">
        {(['val-1', 'val-2', 'val-3', 'val-4'] as const).map((key) => (
          <li
            key={key}
            className="w-full max-w-56 border border-dark-300 px-4 py-6 rounded-xl bg-dark-300/20 flex flex-col gap-y-3"
          >
            <div className="h-12 w-12 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-4/5" />
            <div className="h-4 bg-gray-700 rounded w-3/5" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExperiencesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-px bg-gray-700 mx-4 my-6 xl:mx-auto xl:max-w-237.5" />
      <ul className="flex flex-col mx-4 gap-y-3 xl:mx-auto xl:max-w-237.5">
        {(['exp-1', 'exp-2', 'exp-3'] as const).map((key) => (
          <li
            key={key}
            className="flex flex-col py-6 px-3 bg-dark-200 rounded-xl gap-y-3"
          >
            <div className="h-5 w-3/5 bg-gray-700 rounded" />
            <div className="h-4 w-2/5 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function About({ searchParams }: AboutPageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
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
