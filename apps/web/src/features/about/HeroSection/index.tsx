import { getLocale, getTranslations } from 'next-intl/server';

import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';
import HeroAbout from '~assets/images/hero-about.png';
import { HeroBanner } from '~features/shared/HeroBanner';

interface ProfileHero {
  name: string;
  headline: string;
  bio: string;
  photo: { url: string; alt: string };
}

export async function HeroSection() {
  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('About'),
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const profileRes = await fetch(`${baseUrl}/api/v1/profile?locale=${locale}`, {
    cache: 'no-store',
  }).catch(() => null);

  let profile: ProfileHero | null = null;
  if (profileRes?.ok) {
    const body: ApiResponse<ProfileHero> = await profileRes.json();
    if (!body.error) profile = body.data;
  }

  return (
    <HeroBanner
      src={HeroAbout}
      title={profile?.name ?? t('hero_title')}
      caption={profile?.headline ?? t('hero_caption')}
      content={profile?.bio ?? t('hero_content')}
      alt={t('hero_image_alt')}
      imageClassName="object-contain"
    />
  );
}
