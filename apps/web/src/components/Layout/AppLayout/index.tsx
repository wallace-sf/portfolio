'use client';

import { FC, useMemo, PropsWithChildren } from 'react';

import classNames from 'classnames';
import { useBoolean, useEventListener } from 'usehooks-ts';

import { useThrottle, useBodyClass } from '~hooks';
import { BREAKPOINTS_NUMBERS } from '~utils';

import { Header } from '../Header';
import { LayoutProvider } from '../LayoutContext';
import { SideNavigation } from '../SideNavigation';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const { value: open, setFalse: close, toggle } = useBoolean(false);

  const throttle = useThrottle(() => {
    close();
  }, 500);

  const value = useMemo(() => ({ open, toggle }), [open, toggle]);

  useEventListener('resize', () => {
    if (window.innerWidth < BREAKPOINTS_NUMBERS.lg) throttle();
  });

  useBodyClass(classNames({ 'overflow-hidden': open }));

  return (
    <LayoutProvider value={value}>
      <section className="fixed top-0 left-0 shadow-1 w-full lg:w-auto z-50">
        <Header />
        <SideNavigation />
      </section>
      <div className="flex h-full flex-col ml-0 lg:ml-60 mt-header-mobile lg:mt-20">
        <main className="container h-full flex flex-col flex-1 2xl:px-49">
          {children}
        </main>
      </div>
    </LayoutProvider>
  );
};
