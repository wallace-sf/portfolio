import { GetProfile } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import { getTranslations } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';
import HeroAbout from '~assets/images/hero-about.webp';
import { HeroBanner } from '~features/shared/HeroBanner';

export async function HeroSection({ locale }: { locale: Locale }) {
  const [t, profileResult] = await Promise.all([
    getTranslations({ locale, namespace: 'About' }),
    new GetProfile(getServerContainer().profileRepository).execute({ locale }),
  ]);

  const profile = profileResult.isRight() ? profileResult.value : null;

  return (
    <HeroBanner
      src={HeroAbout}
      title={profile?.name ?? t('hero_title')}
      caption={profile?.headline ?? t('hero_caption')}
      alt={t('hero_image_alt')}
      titleAs="h1"
      titleClassName="text-heading-h1"
      textColumnClassName="lg:w-1/2"
      imageClassName="object-contain"
      className="shadow-drop-md"
    />
  );
}
