'use client';

import { FC, PropsWithChildren } from 'react';

import { ContactSection } from '~features/contact/ContactSection';

import { SideNavigation } from '../SideNavigation';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SideNavigation />
      <div className="flex h-full flex-col ml-0 lg:ml-60 mt-header-mobile lg:mt-0">
        <main className="w-full max-w-237.5 mx-auto h-auto flex flex-col flex-1 pt-6 lg:pt-16 xl:pt-20 px-4 xl:px-0">
          {children}
        </main>
        <footer className="w-full max-w-237.5 mx-auto shadow-drop-up">
          <ContactSection />
        </footer>
      </div>
    </>
  );
};
