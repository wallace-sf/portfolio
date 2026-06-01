'use client';

import { FC, PropsWithChildren, useCallback } from 'react';

import { useBoolean, useScrollLock, useEventListener } from 'usehooks-ts';

import { useThrottle } from '~hooks';
import { BREAKPOINTS_NUMBERS } from '~utils';

import { SideNavigation } from '../SideNavigation';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const { value, setTrue, setFalse } = useBoolean(false);
  const { lock, unlock } = useScrollLock({ autoLock: false });

  const handleToggle = useCallback(() => {
    if (value) {
      setFalse();
      unlock();
      return;
    }

    setTrue();
    lock();
  }, [value, lock, unlock, setFalse, setTrue]);

  const throttle = useThrottle(() => {
    handleToggle();
  }, 500);

  useEventListener('resize', () => {
    if (window.innerWidth < BREAKPOINTS_NUMBERS.lg) throttle();
  });

  return (
    <>
      <SideNavigation open={value} toggle={handleToggle} />
      <div className="flex h-full flex-col ml-0 xl:ml-60 mt-header-mobile xl:mt-20">
        <main className="w-full max-w-237.5 2xl:max-w-278.5 mx-auto h-full flex flex-col flex-1">
          {children}
        </main>
      </div>
    </>
  );
};
