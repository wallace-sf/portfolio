import HeroProjects from '~assets/images/hero-projects.png';
import { HeroBanner } from '~components/View';
import { applyDevSimulations } from '~/dev/simulate';

interface ProjectsPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function Projects({ searchParams }: ProjectsPageProps) {
  await applyDevSimulations(await searchParams);

  return (
    <>
      <HeroBanner
        src={HeroProjects}
        title="Portfólio"
        caption="Conheça alguns dos meus projetos"
        content="Lorem ipsum odor amet, consectetuer adipiscing elit. Nisl ad dictumst donec consequat sollicitudin mauris. Id inceptos nibh varius; maecenas congue ullamcorper. Senectus massa tellus metus, nullam diam amet fringilla."
        alt="Professional Picture 1 of Wallace Ferreira"
        imageClassName="object-contain p-6 xl:py-8"
      />
    </>
  );
}
