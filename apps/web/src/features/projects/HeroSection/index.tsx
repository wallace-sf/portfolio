import { getTranslations } from 'next-intl/server';

import HeroProjects from '~assets/images/hero-projects.png';
import { HeroBanner } from '~features/shared/HeroBanner';

export async function HeroSection() {
  const t = await getTranslations('Projects');

  return (
    <HeroBanner
      src={HeroProjects}
      title={t('hero_title')}
      caption={t('hero_caption')}
      content={t('hero_content')}
      alt={t('hero_image_alt')}
      imageClassName="object-contain p-6 xl:py-8"
    />
  );
}
