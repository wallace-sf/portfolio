import { FC } from 'react';

import HeroProjects from '~assets/images/hero-projects.png';
import { HeroBanner } from '~components/View';

const Projects: FC = () => {
  return (
    <>
      <HeroBanner
        src={HeroProjects}
        title="Portfólio"
        caption="Conheça alguns dos meus projetos"
        content="Lorem ipsum odor amet, consectetuer adipiscing elit. Nisl ad dictumst donec consequat sollicitudin mauris. Id inceptos nibh varius; maecenas congue ullamcorper. Senectus massa tellus metus, nullam diam amet fringilla."
        alt="Professional Picture 1 of Wallace Ferreira"
        imageClassName="object-contain p-6 lg:py-8"
      />
    </>
  );
};

export default Projects;
