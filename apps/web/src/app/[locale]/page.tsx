import { IProjectProps } from '@repo/core';

import HeroLandingPage from '~assets/images/hero-landing-page.png';
import { HeroBanner, ProjectList } from '~components/View';

const PROJECTS: IProjectProps[] = [
  {
    id: '1',
    title: 'Fieldlink Enterprise',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
  },
  {
    id: '2',
    title: 'Fieldlink Form Builder',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '3',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '4',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
  },
  {
    id: '5',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [
      {
        id: '1',
        description: 'Git',
        icon: 'devicon:git',
        type: 'TECHNOLOGY',
      },
      {
        id: '2',
        description: 'jQuery',
        icon: 'devicon:jquery',
        type: 'TECHNOLOGY',
      },
      {
        id: '3',
        description: 'Docker',
        icon: 'devicon:docker',
        type: 'TECHNOLOGY',
      },
      {
        id: '4',
        description: 'Electron',
        icon: 'devicon:electron',
        type: 'TECHNOLOGY',
      },
    ],
  },
  {
    id: '6',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '7',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '8',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '9',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '10',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '11',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
  {
    id: '12',
    title: 'Fieldlink Rotas',
    caption:
      'Ministro determinou que a Caixa regularize o pagamento à conta certa antes de a PGR analisar a volta da rede social ao ar no Brasil.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: [],
  },
];

export default function Home() {
  return (
    <>
      <HeroBanner
        src={HeroLandingPage}
        title="Wallace Ferreira"
        caption="Software Engineer"
        content="Lorem ipsum odor amet, consectetuer adipiscing elit. Nisl ad dictumst donec consequat sollicitudin mauris. Id inceptos nibh varius; maecenas congue ullamcorper. Senectus massa tellus metus, nullam diam amet fringilla."
        alt="Professional Picture 1 of Wallace Ferreira"
        imageClassName="object-contain 2xl:object-cover"
      />
      <h4 className="text-white mt-8 mb-4 ml-4 md:mx-[33px] lg:mx-[124px] xl:mt-20 xl:mb-8 !text-xl xl:!text-[32px]">
        Projetos
      </h4>
      <ProjectList projects={PROJECTS} view="grid" className="pb-8 xl:pb-20" />
    </>
  );
}
