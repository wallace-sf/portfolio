import { GetExperiences } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';

import { getServerContainer } from '~/lib/server/container';

import { ExperienceCard, IExperienceCardProps } from './ExperienceCard';

export async function ExperiencesSection({ locale }: { locale: Locale }) {
  const { experienceRepository, skillRepository } = getServerContainer();
  const experiencesResult = await new GetExperiences(
    experienceRepository,
    skillRepository,
  ).execute({ locale });

  const experiences: IExperienceCardProps[] = experiencesResult.isRight()
    ? experiencesResult.value
    : [];

  return (
    <ul className="flex flex-col">
      {experiences.map((experience) => (
        <li
          key={experience.id}
          className="border-b border-border-default last:border-b-0"
        >
          <ExperienceCard {...experience} />
        </li>
      ))}
    </ul>
  );
}
