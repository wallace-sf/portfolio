import { FC, PropsWithChildren } from 'react';

import { ContactSection } from '~features/contact/ContactSection';

import { SideNavigation } from '../SideNavigation';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SideNavigation />
      <div className="ml-0 mt-header-mobile flex h-full flex-col lg:ml-60 lg:mt-0">
        <main className="mx-auto flex h-auto w-full max-w-237.5 flex-1 flex-col px-4 pt-6 lg:pt-16 xl:px-0 xl:pt-20">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-237.5 shadow-drop-up">
          <ContactSection />
        </footer>
      </div>
    </>
  );
};
