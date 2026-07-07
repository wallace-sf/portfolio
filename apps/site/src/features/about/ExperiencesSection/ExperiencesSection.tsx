import { GetExperiences } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import classNames from 'classnames';
import { getTranslations } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';

import { ExperienceCard, IExperienceCardProps } from './ExperienceCard';

export async function ExperiencesSection({ locale }: { locale: Locale }) {
  const { experienceRepository, skillRepository } = getServerContainer();
  const [t, experiencesResult] = await Promise.all([
    getTranslations({ locale, namespace: 'About' }),
    new GetExperiences(experienceRepository, skillRepository).execute({
      locale,
    }),
  ]);

  const experiences: IExperienceCardProps[] = experiencesResult.isRight()
    ? experiencesResult.value
    : [];

  if (experiences.length === 0) return null;

  return (
    <section className="mt-10 flex flex-col gap-y-4 xl:mt-16 2xl:mt-20">
      <h2 className="text-heading-h4 text-left">{t('experience_title')}</h2>
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
    </section>
  );
}
