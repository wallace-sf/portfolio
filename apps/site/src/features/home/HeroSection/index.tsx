import { type ProfileDTO } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import { screens } from '@repo/tailwind-config/screens';
import { getTranslations } from 'next-intl/server';

import HeroLandingPage from '~assets/images/hero-landing-page.webp';
import { HeroBanner } from '~features/shared/HeroBanner';
import { StatCard } from '~features/shared/StatCard';

const HERO_WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048];
const HERO_SIZES = `(max-width: ${screens.xl}) 100vw, 50vw`;

interface HeroSectionProps {
  locale: Locale;
  profile: ProfileDTO | null;
}

export async function HeroSection({ locale, profile }: HeroSectionProps) {
  const t = await getTranslations({ locale, namespace: 'Home' });

  const photoUrl = profile?.photo.url;
  const preloadSrcSet = photoUrl
    ? HERO_WIDTHS.map(
        (w) =>
          `/_next/image?url=${encodeURIComponent(photoUrl)}&w=${w}&q=100 ${w}w`,
      ).join(', ')
    : undefined;

  return (
    <>
      {preloadSrcSet && (
        <link
          rel="preload"
          as="image"
          fetchPriority="high"
          imageSrcSet={preloadSrcSet}
          imageSizes={HERO_SIZES}
        />
      )}
      <HeroBanner
        src={profile?.photo.url ?? HeroLandingPage}
        title={profile?.name ?? t('hero_title')}
        caption={profile?.headline ?? t('hero_caption')}
        alt={profile?.photo.alt ?? t('hero_image_alt')}
        titleSize="lg"
        titleAs="h1"
        textColumnClassName="lg:w-1/2"
        imageClassName="object-contain 2xl:object-cover"
        className="shadow-drop-md"
      />
      {profile?.stats && profile.stats.length > 0 && (
        <section className="my-6 grid grid-cols-2 gap-3 lg:mx-auto lg:my-8 lg:w-full lg:max-w-237.5 lg:grid-cols-4">
          {profile.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>
      )}
    </>
  );
}
