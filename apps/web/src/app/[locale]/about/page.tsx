import { getLocale, getTranslations } from 'next-intl/server';

import { Divider } from '@repo/ui/View';

import {
  ExperienceCard,
  IExperienceCardProps,
  ProfessionalValue,
} from '~components/View';
import { applyDevSimulations } from '~/dev/simulate';
import { ApiResponse } from '~/lib/api/envelope';
import { getInternalBaseUrl } from '~/lib/api/internal';

const PROFESSIONAL_VALUES = [
  {
    id: '1',
    icon: 'material-symbols:acute-rounded',
    content:
      'Agilidade na entrega de soluções de forma <span style="color: #8EFB9D"><b>rápida e eficiente</b></span>, mantendo a qualidade',
  },
  {
    id: '2',
    icon: 'material-symbols:diamond',
    content:
      'Entrega de produtos de alta qualidade que atendam aos requisitos do cliente',
  },
  {
    id: '3',
    icon: 'material-symbols:sdk-rounded',
    content:
      'Capacidade para lidar com uma variedade de projetos e tecnologias',
  },
  {
    id: '4',
    icon: 'material-symbols:3p-rounded',
    content:
      'Comunicação clara e eficaz para garantir que as expectativas do cliente sejam e atendidas',
  },
];

interface AboutPageProps {
  searchParams?: Promise<{ loading?: string; error?: string }>;
}

export default async function About({ searchParams }: AboutPageProps) {
  await applyDevSimulations(await searchParams);

  const [t, locale, baseUrl] = await Promise.all([
    getTranslations('About'),
    getLocale(),
    getInternalBaseUrl(),
  ]);

  const experiencesRes = await fetch(
    `${baseUrl}/api/v1/experiences?locale=${locale}`,
    { cache: 'no-store' },
  ).catch(() => null);

  let experiences: IExperienceCardProps[] = [];
  if (experiencesRes?.ok) {
    const body: ApiResponse<IExperienceCardProps[]> =
      await experiencesRes.json();
    if (!body.error) experiences = body.data;
  }

  return (
    <>
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        {t('values_title')}
      </h4>
      <ul className="flex flex-row gap-x-4">
        {PROFESSIONAL_VALUES.map((professionalValue) => (
          <li key={professionalValue.id}>
            <ProfessionalValue {...professionalValue} />
          </li>
        ))}
      </ul>
      <Divider className="mx-4" />
      <ul className="flex flex-col mx-4 gap-y-3 xl:gap-y-0">
        {experiences.map((experience) => (
          <li key={experience.id} className="[&:last-of-type>hr]:hidden">
            <ExperienceCard {...experience} />
            <Divider className="hidden xl:block" />
          </li>
        ))}
      </ul>
    </>
  );
}
