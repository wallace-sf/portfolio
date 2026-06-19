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
    <section className="mt-10 flex flex-col gap-y-4 xl:mt-16 2xl:mt-20">
      <h2 className="text-left text-[32px] font-bold text-content-primary">
        {t('values_title')}
      </h2>
      <ul className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {professionalValues.map((professionalValue) => (
          <li key={professionalValue.id}>
            <ProfessionalValueCard {...professionalValue} />
          </li>
        ))}
      </ul>
    </section>
  );
}
