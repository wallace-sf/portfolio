import { applyDevSimulations } from '~/dev/simulate';
import { ExperiencesSection } from '~features/about/ExperiencesSection';
import { HeroSection } from '~features/about/HeroSection';
import { ValuesSection } from '~features/about/ValuesSection';

interface AboutPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function About({ searchParams }: AboutPageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <HeroSection />
      <ValuesSection />
      <ExperiencesSection />
    </>
  );
}
