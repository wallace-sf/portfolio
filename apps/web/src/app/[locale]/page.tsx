import { applyDevSimulations } from '~/dev/simulate';
import { ContactSection } from '~features/contact/ContactSection';
import { HeroSection } from '~features/home/HeroSection';
import { ProjectsSection } from '~features/home/ProjectsSection';

interface HomePageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
