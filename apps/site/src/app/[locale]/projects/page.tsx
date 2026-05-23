import { Suspense } from 'react';
import type { Metadata } from 'next';

import { applyDevSimulations } from '~/dev/simulate';
import { HeroSection } from '~features/projects/HeroSection';
import { ProjectsSection } from '~features/projects/ProjectsSection';
import { ProjectsSkeleton } from '~features/home/ProjectsSection';
import { HeroBannerSkeleton } from '~features/shared/HeroBanner/HeroBannerSkeleton';

interface ProjectsPageProps {
  params?: Promise<{ locale: string }>;
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const locale = (await params)?.locale ?? 'en-US';
  const title = locale.startsWith('pt')
    ? 'Projetos'
    : locale.startsWith('es')
      ? 'Proyectos'
      : 'Projects';
  const description = locale.startsWith('pt')
    ? 'Projetos de software desenvolvidos por Wallace Ferreira — aplicações web escaláveis com React, Next.js e TypeScript.'
    : locale.startsWith('es')
      ? 'Proyectos de software desarrollados por Wallace Ferreira — aplicaciones web escalables con React, Next.js y TypeScript.'
      : 'Software projects developed by Wallace Ferreira — scalable web applications built with React, Next.js, and TypeScript.';

  return { title, description, openGraph: { title, description } };
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
