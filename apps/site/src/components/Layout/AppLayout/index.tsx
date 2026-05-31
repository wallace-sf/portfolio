'use client';

import { FC, PropsWithChildren } from 'react';

// import { useBoolean, useEventListener } from 'usehooks-ts';

// import { useThrottle } from '~hooks';
// import { BREAKPOINTS_NUMBERS } from '~utils';

import { SideNavigation } from '../SideNavigation';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  // const throttle = useThrottle(() => {
  //   close();
  // }, 500);

  // const value = useMemo(() => ({ open, toggle, close }), [open, toggle, close]);

  // useEventListener('resize', () => {
  //   if (window.innerWidth < BREAKPOINTS_NUMBERS.lg) throttle();
  // });

  // useBodyClass(classNames({ 'overflow-hidden': open }));

  return (
    <>
      <SideNavigation />
      <div className="flex h-full flex-col ml-0 xl:ml-60 xl:mt-20">
        <main className="w-full max-w-237.5 2xl:max-w-278.5 mx-auto h-full flex flex-col flex-1">
          {children}
        </main>
      </div>
    </>
  );
};
