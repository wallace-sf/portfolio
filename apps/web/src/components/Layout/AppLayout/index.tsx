'use client';

import { FC, useMemo } from 'react';

import { useBoolean, useEventListener } from 'usehooks-ts';

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
    </LayoutProvider>
  );
};
