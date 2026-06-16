import { GetProfessionalValues } from '@repo/application/portfolio';
import { type Locale } from '@repo/core/shared';
import { getTranslations } from 'next-intl/server';

import { getServerContainer } from '~/lib/server/container';

import {
  IProfessionalValueCardProps,
  ProfessionalValueCard,
} from './ProfessionalValueCard';

export async function ValuesSection({ locale }: { locale: Locale }) {
  const [t, valuesResult] = await Promise.all([
    getTranslations({ locale, namespace: 'About' }),
    new GetProfessionalValues(
      getServerContainer().professionalValueRepository,
    ).execute({ locale }),
  ]);

  const professionalValues: IProfessionalValueCardProps[] =
    valuesResult.isRight() ? valuesResult.value : [];

  return (
    <>
      <h2 className="text-[32px] font-bold text-content-primary text-left mb-6 mx-4 lg:mx-0">
        {t('values_title')}
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch mx-4 lg:mx-0">
        {professionalValues.map((professionalValue) => (
          <li key={professionalValue.id}>
            <ProfessionalValueCard {...professionalValue} />
          </li>
        ))}
      </ul>
    </>
  );
}
