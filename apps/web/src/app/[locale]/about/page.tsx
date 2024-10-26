import { FC } from 'react';

import { IProfessionalValueProps } from '@repo/core';

import { ProfessionalValue } from '~components/View';

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

const About: FC = () => {
  return (
    <>
      <ul className="flex flex-row gap-x-4">
        {PROFESSIONAL_VALUES.map((professionalValue) => (
          <li key={professionalValue.id}>
            <ProfessionalValue {...professionalValue} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default About;
