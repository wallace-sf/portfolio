import { getLocale, getTranslations } from 'next-intl/server';

import { Divider } from '@repo/ui/View';

import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

import {
  IProfessionalValueCardProps,
  ProfessionalValue,
} from './ProfessionalValue';

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
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        {t('values_title')}
      </h4>
      <ul className="flex flex-row gap-x-4">
        {professionalValues.map((professionalValue) => (
          <li key={professionalValue.id}>
            <ProfessionalValue {...professionalValue} />
          </li>
        ))}
      </ul>
      <Divider className="mx-4" />
    </>
  );
}
