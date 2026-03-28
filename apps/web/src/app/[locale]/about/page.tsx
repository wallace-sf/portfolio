import { FC } from 'react';

import {
  IProfessionalValueProps,
  IExperienceProps,
} from '@repo/core/portfolio';
import { Divider } from '@repo/ui/View';

import { ProfessionalValue, ExperienceCard } from '~components/View';

const PROFESSIONAL_VALUES: IProfessionalValueProps[] = [
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

const EXPERIENCES: IExperienceProps[] = [
  {
    id: '1',
    company: { 'pt-BR': 'WESF Serviços de TI' },
    employment_type: 'FREELANCE',
    location: { 'pt-BR': 'São Paulo, Brasil' },
    position: { 'pt-BR': 'Desenvolvedor Full-Stack' },
    description: {
      'pt-BR': 'Desenvolvimento de soluções full-stack para clientes.',
    },
    logo: { url: 'https://placehold.co/48x48', alt: { 'pt-BR': 'WESF logo' } },
    location_type: 'REMOTE',
    skills: [],
    start_at: '2021-01-01T00:00:00.000Z',
    end_at: '2022-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    company: { 'pt-BR': 'Galaxies' },
    employment_type: 'PART_TIME',
    location: { 'pt-BR': 'São Paulo, Brasil' },
    position: { 'pt-BR': 'Desenvolvedor Front-end' },
    description: {
      'pt-BR': 'Desenvolvimento de interfaces para plataforma SaaS.',
    },
    logo: {
      url: 'https://placehold.co/48x48',
      alt: { 'pt-BR': 'Galaxies logo' },
    },
    location_type: 'REMOTE',
    skills: [],
    start_at: '2022-01-01T00:00:00.000Z',
    end_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    company: {
      'pt-BR':
        'FDTE - Fundação para o Desenvolvimento Técnológico da Engenharia',
    },
    employment_type: 'FULL_TIME',
    location: { 'pt-BR': 'São Paulo, Brasil' },
    position: { 'pt-BR': 'Desenvolvedor Front-end' },
    description: { 'pt-BR': 'Desenvolvimento de sistemas para engenharia.' },
    logo: { url: 'https://placehold.co/48x48', alt: { 'pt-BR': 'FDTE logo' } },
    location_type: 'HYBRID',
    skills: [],
    start_at: '2023-01-01T00:00:00.000Z',
    end_at: '2024-01-01T00:00:00.000Z',
  },
];

const About: FC = () => {
  return (
    <>
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        Meus valores profissionais
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
        {EXPERIENCES.map((experience) => (
          <li key={experience.id} className="[&:last-of-type>hr]:hidden">
            <ExperienceCard {...experience} />
            <Divider className="hidden xl:block" />
          </li>
        ))}
      </ul>
    </>
  );
};

export default About;
