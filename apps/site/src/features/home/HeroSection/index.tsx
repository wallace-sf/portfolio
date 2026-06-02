import { getLocale, getTranslations } from 'next-intl/server';

import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';
import HeroLandingPage from '~assets/images/hero-landing-page.png';
import { HeroBanner } from '~features/shared/HeroBanner';
import { StatCard } from '~features/shared/StatCard';

interface ProfileStat {
  label: string;
  value: string;
  icon: string;
}

interface ProfileHero {
  name: string;
  headline: string;
  bio: string;
  photo: { url: string; alt: string };
  stats: ProfileStat[];
}

export async function HeroSection() {
  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('Home'),
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
    <>
      <HeroBanner
        src={profile?.photo.url ?? HeroLandingPage}
        title={profile?.name ?? t('hero_title')}
        caption={profile?.headline ?? t('hero_caption')}
        content={profile?.bio ?? t('hero_content')}
        alt={profile?.photo.alt ?? t('hero_image_alt')}
        titleSize="lg"
        titleAs="h2"
        textColumnClassName="xl:w-[474px]"
        imageClassName="object-contain 2xl:object-cover"
      />
      {profile?.stats && profile.stats.length > 0 && (
        <section className="mx-4 my-6 grid grid-cols-2 gap-3 xl:mx-auto xl:my-8 xl:w-full xl:max-w-237.5 xl:grid-cols-4">
          {profile.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>
      )}
    </>
  );
}
