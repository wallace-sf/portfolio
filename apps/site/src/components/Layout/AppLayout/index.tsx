'use client';

import { FC, PropsWithChildren } from 'react';

import { ContactSection } from '~features/contact/ContactSection';

import { SideNavigation } from '../SideNavigation';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SideNavigation />
      <div className="flex h-full flex-col ml-0 xl:ml-60 mt-header-mobile xl:mt-20">
        <main className="w-full max-w-237.5 mx-auto h-auto flex flex-col flex-1">
          {children}
        </main>
        <footer className="w-full max-w-237.5 mx-auto">
          <ContactSection />
        </footer>
      </div>
    </>
  );
};
