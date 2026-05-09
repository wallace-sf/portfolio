import { Divider } from '@repo/ui/View';
import { getLocale, getTranslations } from 'next-intl/server';

import { applyDevSimulations } from '~/dev/simulate';
import { getInternalBaseUrl } from '~/lib/api/internal';
import { ApiResponse } from '~/lib/api/envelope';
import HeroLandingPage from '~assets/images/hero-landing-page.png';
import { ContactForm, HeroBanner, ProjectList, ContactInfo } from '~components';

import { ProjectSummary } from '~components/View/ProjectList';

interface ProfileHero {
  name: string;
  headline: string;
  bio: string;
  photo: { url: string; alt: string };
}

interface HomePageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  await applyDevSimulations(await searchParams);

  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('Home'),
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const [projectsRes, profileRes] = await Promise.all([
    fetch(`${baseUrl}/api/v1/projects/featured?locale=${locale}`, {
      cache: 'no-store',
    }).catch(() => null),
    fetch(`${baseUrl}/api/v1/profile?locale=${locale}`, {
      cache: 'no-store',
    }).catch(() => null),
  ]);

  let projects: ProjectSummary[] = [];
  if (projectsRes?.ok) {
    const body: ApiResponse<ProjectSummary[]> = await projectsRes.json();
    if (!body.error) projects = body.data;
  }

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
        imageClassName="object-contain 2xl:object-cover"
      />
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        {t('projects_title')}
      </h4>
      <ProjectList projects={projects} view="grid" className="pb-8 xl:pb-20" />
      <section className="flex flex-col gap-x-6 xl:flex-row mx-4 xl:mx-auto xl:w-full xl:max-w-237.5">
        <ContactForm />
        <Divider className="xl:hidden" />
        <ContactInfo />
      </section>
    </>
  );
}
