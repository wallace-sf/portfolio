import { applyDevSimulations } from '~/dev/simulate';
import { HeroSection } from '~features/projects/HeroSection';
import { ProjectsSection } from '~features/projects/ProjectsSection';

interface ProjectsPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function Projects({ searchParams }: ProjectsPageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <HeroSection />
      <ProjectsSection />
    </>
  );
}
