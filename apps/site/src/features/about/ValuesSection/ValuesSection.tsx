import { getLocale, getTranslations } from 'next-intl/server';

import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

import {
  IProfessionalValueCardProps,
  ProfessionalValueCard,
} from './ProfessionalValueCard';

export async function ValuesSection() {
  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('About'),
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const res = await fetch(
    `${baseUrl}/api/v1/professional-values?locale=${locale}`,
    { cache: 'no-store' },
  ).catch(() => null);

  let professionalValues: IProfessionalValueCardProps[] = [];
  if (res?.ok) {
    const body: ApiResponse<IProfessionalValueCardProps[]> = await res.json();
    if (!body.error) professionalValues = body.data;
  }

  return (
    <>
      <h2 className="text-[32px] font-bold text-content-primary text-left mt-10 mb-6">
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
