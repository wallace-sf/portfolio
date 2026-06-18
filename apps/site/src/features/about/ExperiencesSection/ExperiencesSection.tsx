import { GetExperiences } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import classNames from 'classnames';

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
      {experiences.map((experience, i) => (
        <li
          key={experience.id}
          className={classNames(
            'border-b border-border-default last:border-b-0 py-6',
            {
              'pt-0': i === 0,
              'pb-0': i === experiences.length - 1,
            },
          )}
        >
          <ExperienceCard {...experience} />
        </li>
      ))}
    </ul>
  );
}
