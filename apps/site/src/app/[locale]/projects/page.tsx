import { GetPublishedProjects } from '@repo/application/portfolio';
import { type Locale, LOCALES } from '@repo/core/shared';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';
import { HeroSection } from '~features/projects/HeroSection';
import { ProjectsSection } from '~features/projects/ProjectsSection';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface ProjectsPageProps {
  params?: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const locale = ((await params)?.locale ?? 'en-US') as Locale;
  setRequestLocale(locale);

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

export default async function Projects({ params }: ProjectsPageProps) {
  const locale = ((await params)?.locale ?? 'en-US') as Locale;
  setRequestLocale(locale);

  const { projectRepository, skillRepository } = getServerContainer();
  const result = await new GetPublishedProjects(
    projectRepository,
    skillRepository,
  ).execute({ locale });

  const projects = result.isRight() ? result.value : [];

  return (
    <>
      <HeroSection locale={locale} />
      <ProjectsSection projects={projects} />
    </>
  );
}
