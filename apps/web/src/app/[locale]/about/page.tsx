import { FC } from 'react';

import { IProfessionalValueProps, IExperienceProps } from '@repo/core';

import { ProfessionalValue, ExperienceCard, Divider } from '~components/View';

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
    company: 'WESF Serviços de TI',
    employment_type: 'FREELANCE',
    location: 'São Paulo, Brazil',
    position: 'Desenvolvedor Full-Stack',
    location_type: 'REMOTE',
    skills: [
      {
        id: '1',
        description: 'React.js',
        icon: 'devicon:react',
        type: 'TECHNOLOGY',
      },
      {
        id: '2',
        description: 'Angular',
        icon: 'devicon:angular',
        type: 'TECHNOLOGY',
      },
      {
        id: '3',
        description: 'Typescript',
        icon: 'devicon:typescript',
        type: 'TECHNOLOGY',
      },
      {
        id: '4',
        description: 'Electron',
        icon: 'devicon:electron',
        type: 'TECHNOLOGY',
      },
    ],
    start_at: new Date().toISOString(),
    end_at: new Date().toISOString(),
  },
  {
    id: '2',
    company: 'Galaxies',
    employment_type: 'PART_TIME',
    location: 'São Paulo, Brazil',
    position: 'Desenvolvedor Front-end',
    location_type: 'REMOTE',
    skills: [
      {
        id: '1',
        description: 'Next.js',
        icon: 'devicon:nextjs',
        type: 'TECHNOLOGY',
      },
      {
        id: '2',
        description: 'TailwindCSS',
        icon: 'devicon:tailwindcss',
        type: 'TECHNOLOGY',
      },
      {
        id: '3',
        description: 'Material UI',
        icon: 'devicon:materialui',
        type: 'TECHNOLOGY',
      },
      {
        id: '4',
        description: 'Electron',
        icon: 'devicon:electron',
        type: 'TECHNOLOGY',
      },
    ],
    start_at: new Date().toISOString(),
    end_at: new Date().toISOString(),
  },
  {
    id: '3',
    company: 'FDTE - Fundação para o Desenvolvimento Técnológico da Engenharia',
    employment_type: 'FULL_TIME',
    location: 'São Paulo, Brazil',
    position: 'Desenvolvedor Front-end',
    location_type: 'HYBRID',
    skills: [
      {
        id: '1',
        description: 'React.js',
        icon: 'devicon:react',
        type: 'TECHNOLOGY',
      },
      {
        id: '2',
        description: 'Angular',
        icon: 'devicon:angular',
        type: 'TECHNOLOGY',
      },
      {
        id: '3',
        description: 'Typescript',
        icon: 'devicon:typescript',
        type: 'TECHNOLOGY',
      },
      {
        id: '4',
        description: 'Electron',
        icon: 'devicon:electron',
        type: 'TECHNOLOGY',
      },
    ],
    start_at: new Date().toISOString(),
    end_at: new Date().toISOString(),
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
