import { getLocale } from 'next-intl/server';

import { Divider } from '@repo/ui/View';

import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

import { ExperienceCard, IExperienceCardProps } from './ExperienceCard';

export async function ExperiencesSection() {
  const [locale, baseUrl] = await Promise.all([
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const res = await fetch(`${baseUrl}/api/v1/experiences?locale=${locale}`, {
    cache: 'no-store',
  }).catch(() => null);

  let experiences: IExperienceCardProps[] = [];
  if (res?.ok) {
    const body: ApiResponse<IExperienceCardProps[]> = await res.json();
    if (!body.error) experiences = body.data;
  }

  return (
    <ul className="flex flex-col mx-4 gap-y-3 xl:gap-y-0">
      {experiences.map((experience) => (
        <li key={experience.id} className="[&:last-of-type>hr]:hidden">
          <ExperienceCard {...experience} />
          <Divider className="hidden xl:block" />
        </li>
      ))}
    </ul>
  );
}
