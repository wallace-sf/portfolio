import { Divider } from '@repo/ui/View';
import { getLocale, getTranslations } from 'next-intl/server';

import { applyDevSimulations } from '~/dev/simulate';
import { getInternalBaseUrl } from '~/lib/api/internal';
import { ApiResponse } from '~/lib/api/envelope';
import { HeroSection } from '~features/home/HeroSection';
import { ProjectList, ProjectSummary } from '~features/home/ProjectsSection';
import { ContactForm } from '~features/contact/ContactForm';
import { ContactInfo } from '~features/contact/ContactInfo';
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
      <HeroSection
        profile={profile}
        title={t('hero_title')}
        caption={t('hero_caption')}
        content={t('hero_content')}
        alt={t('hero_image_alt')}
      />
      {profile?.stats && profile.stats.length > 0 && (
        <section className="mx-4 my-6 grid grid-cols-2 gap-3 xl:mx-auto xl:my-8 xl:w-full xl:max-w-237.5 xl:grid-cols-4">
          {profile.stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </section>
      )}
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
