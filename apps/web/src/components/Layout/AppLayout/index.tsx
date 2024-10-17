'use client';

import { FC, useMemo } from 'react';

import { useBoolean, useEventListener } from 'usehooks-ts';

import { ProjectCard } from '~components/View';
import { useThrottleFn } from '~hooks';
import { BREAKPOINTS_NUMBERS } from '~utils';

import { Header } from '../Header';
import { LayoutProvider } from '../LayoutContext';
import { SideNavigation } from '../SideNavigation';

export const AppLayout: FC = () => {
  const { value: open, setFalse: close, toggle } = useBoolean(false);

  const throttle = useThrottleFn(() => {
    close();
  }, 500);

  const value = useMemo(() => ({ open, toggle }), [open, toggle]);

  useEventListener('resize', () => {
    if (window.innerWidth < BREAKPOINTS_NUMBERS.lg) throttle();
  });

  return (
    <LayoutProvider value={value}>
      <section className="absolute top-0 left-0 shadow-1 w-full lg:w-auto">
        <Header />
        <SideNavigation />
      </section>
      <div className="flex flex-col h-auto ml-0 lg:ml-60 mt-header-mobile lg:mt-20">
        <main className="container flex flex-col flex-1 mx-auto">
          <ProjectCard
            title="Fieldlink Enterprise"
            caption="A Fieldlink é uma startup de tecnologia que oferece soluções de gestão de equipe de vendas, indicadores de cumprimentos de metas, definições de fluxos de trabalho, orientação de equipes externas e relatórios automatizados da produção."
            view="row"
          />
        </main>
      </div>
    </LayoutProvider>
  );
};