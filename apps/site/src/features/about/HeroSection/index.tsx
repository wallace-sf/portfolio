import { GetProfile } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import { getLocale, getTranslations } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';
import HeroAbout from '~assets/images/hero-about.png';
import { HeroBanner } from '~features/shared/HeroBanner';

export async function HeroSection() {
  const [t, locale] = await Promise.all([
    getTranslations('About'),
    getLocale(),
  ]);

  const { profileRepository } = getServerContainer();
  const profileResult = await new GetProfile(profileRepository).execute({
    locale: locale as Locale,
  });

  const profile = profileResult.isRight() ? profileResult.value : null;

  return (
    <HeroBanner
      src={HeroAbout}
      title={profile?.headline ?? t('hero_caption')}
      caption={profile?.name ?? t('hero_title')}
      content={profile?.bio ?? t('hero_content')}
      alt={t('hero_image_alt')}
      titleSize="xl"
      titleAs="h1"
      textColumnClassName="xl:w-[382px]"
      imageClassName="object-contain"
    />
  );
}
