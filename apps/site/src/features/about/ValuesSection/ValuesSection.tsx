import { GetProfessionalValues } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import { getLocale, getTranslations } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';

import {
  IProfessionalValueCardProps,
  ProfessionalValueCard,
} from './ProfessionalValueCard';

export async function ValuesSection() {
  const [t, locale] = await Promise.all([
    getTranslations('About'),
    getLocale(),
  ]);

  const { professionalValueRepository } = getServerContainer();
  const valuesResult = await new GetProfessionalValues(
    professionalValueRepository,
  ).execute({ locale: locale as Locale });

  const professionalValues: IProfessionalValueCardProps[] =
    valuesResult.isRight() ? valuesResult.value : [];

  return (
    <>
      <h2 className="text-[32px] font-bold text-content-primary text-left mb-6">
        {t('values_title')}
      </h2>
      <ul className="grid grid-cols-4 gap-4 items-stretch">
        {professionalValues.map((professionalValue) => (
          <li key={professionalValue.id}>
            <ProfessionalValueCard {...professionalValue} />
          </li>
        ))}
      </ul>
    </>
  );
}
