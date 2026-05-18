import { FC } from 'react';

import HeroProjects from '~assets/images/hero-projects.png';
import { HeroBanner } from '~features/shared/HeroBanner';

interface IHeroSectionProps {
  title: string;
  caption: string;
  content: string;
  alt: string;
}

export const HeroSection: FC<IHeroSectionProps> = (props) => (
  <HeroBanner
    {...props}
    src={HeroProjects}
    imageClassName="object-contain p-6 xl:py-8"
  />
);
