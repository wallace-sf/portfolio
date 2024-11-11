import { IProjectProps } from '@repo/core';
import { useTranslations } from 'next-intl';

import HeroLandingPage from '~assets/images/hero-landing-page.png';
import {
  ContactForm,
  Divider,
  HeroBanner,
  ProjectList,
  ContactInfo,
} from '~components';

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
];

export default function Home() {
  const t = useTranslations('Home');

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
      <h4 className="text-white mx-4 my-6 !text-xl xl:block xl:mx-auto xl:my-8 xl:w-full xl:!text-[32px] xl:max-w-237.5">
        {t('projects_title')}
      </h4>
      <ProjectList projects={PROJECTS} view="grid" className="pb-8 xl:pb-20" />
      <section className="flex flex-col gap-x-6 xl:flex-row mx-4 xl:mx-auto xl:w-full xl:max-w-237.5">
        <ContactForm />
        <Divider className="xl:hidden" />
        <ContactInfo />
      </section>
    </>
  );
}
