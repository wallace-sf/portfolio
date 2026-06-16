import { type ProfileDTO } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import { getTranslations } from 'next-intl/server';

import HeroLandingPage from '~assets/images/hero-landing-page.png';
import { HeroBanner } from '~features/shared/HeroBanner';
import { StatCard } from '~features/shared/StatCard';

interface HeroSectionProps {
  locale: Locale;
  profile: ProfileDTO | null;
}

export async function HeroSection({ locale, profile }: HeroSectionProps) {
  const t = await getTranslations({ locale, namespace: 'Home' });

  return (
    <>
      <HeroBanner
        src={profile?.photo.url ?? HeroLandingPage}
        title={profile?.name ?? t('hero_title')}
        caption={profile?.headline ?? t('hero_caption')}
        content={profile?.bio ?? t('hero_content')}
        alt={profile?.photo.alt ?? t('hero_image_alt')}
        titleSize="lg"
        titleAs="h1"
        textColumnClassName="lg:w-1/2"
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
