import { FC } from 'react';

import { StaticImageData } from 'next/image';

import HeroLandingPage from '~assets/images/hero-landing-page.png';
import { HeroBanner } from '~features/shared/HeroBanner';

interface ProfilePhoto {
  url: string;
  alt: string;
}

interface IHeroSectionProps {
  profile?: {
    name: string;
    headline: string;
    bio: string;
    photo: ProfilePhoto;
  } | null;
  title: string;
  caption: string;
  content: string;
  alt: string;
  fallbackSrc?: StaticImageData;
}

export const HeroSection: FC<IHeroSectionProps> = ({
  profile,
  title,
  caption,
  content,
  alt,
  fallbackSrc = HeroLandingPage,
}) => (
  <HeroBanner
    src={profile?.photo.url ?? fallbackSrc}
    title={profile?.name ?? title}
    caption={profile?.headline ?? caption}
    content={profile?.bio ?? content}
    alt={profile?.photo.alt ?? alt}
    imageClassName="object-contain 2xl:object-cover"
  />
);
