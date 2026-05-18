import { getLocale, getTranslations } from 'next-intl/server';

import { Divider } from '@repo/ui/View';

import {
  ExperienceCard,
  HeroBanner,
  IExperienceCardProps,
  IProfessionalValueCardProps,
  ProfessionalValue,
} from '~components/View';
import HeroAbout from '~assets/images/hero-about.png';
import { applyDevSimulations } from '~/dev/simulate';
import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

interface ProfileHero {
  name: string;
  headline: string;
  bio: string;
  photo: { url: string; alt: string };
}

interface AboutPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function About({ searchParams }: AboutPageProps) {
  await applyDevSimulations(await searchParams);

  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('About'),
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const [experiencesRes, professionalValuesRes, profileRes] = await Promise.all(
    [
      fetch(`${baseUrl}/api/v1/experiences?locale=${locale}`, {
        cache: 'no-store',
      }).catch(() => null),
      fetch(`${baseUrl}/api/v1/professional-values?locale=${locale}`, {
        cache: 'no-store',
      }).catch(() => null),
      fetch(`${baseUrl}/api/v1/profile?locale=${locale}`, {
        cache: 'no-store',
      }).catch(() => null),
    ],
  );

  let experiences: IExperienceCardProps[] = [];
  if (experiencesRes?.ok) {
    const body: ApiResponse<IExperienceCardProps[]> =
      await experiencesRes.json();
    if (!body.error) experiences = body.data;
  }

  let professionalValues: IProfessionalValueCardProps[] = [];
  if (professionalValuesRes?.ok) {
    const body: ApiResponse<IProfessionalValueCardProps[]> =
      await professionalValuesRes.json();
    if (!body.error) professionalValues = body.data;
  }

  let profile: ProfileHero | null = null;
  if (profileRes?.ok) {
    const body: ApiResponse<ProfileHero> = await profileRes.json();
    if (!body.error) profile = body.data;
  }

  return (
    <>
      <HeroBanner
        src={HeroAbout}
        title={profile?.name ?? t('hero_title')}
        caption={profile?.headline ?? t('hero_caption')}
        content={profile?.bio ?? t('hero_content')}
        alt={t('hero_image_alt')}
        imageClassName="object-contain"
      />
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        {t('values_title')}
      </h4>
      <ul className="flex flex-row gap-x-4">
        {professionalValues.map((professionalValue) => (
          <li key={professionalValue.id}>
            <ProfessionalValue {...professionalValue} />
          </li>
        ))}
      </ul>
      <Divider className="mx-4" />
      <ul className="flex flex-col mx-4 gap-y-3 xl:gap-y-0">
        {experiences.map((experience) => (
          <li key={experience.id} className="[&:last-of-type>hr]:hidden">
            <ExperienceCard {...experience} />
            <Divider className="hidden xl:block" />
          </li>
        ))}
      </ul>
    </>
  );
}
