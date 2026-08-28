import { FC, PropsWithChildren } from 'react';

/**
 * The footer band shared across the `site` and `blog` zones: the `<footer>`
 * landmark with the consistent max width and upward shadow, plus the inner
 * surface band (padding, top border, and a slight full-bleed at `2xl`). The
 * negative bleed margin lives on the inner element so it never fights the
 * outer `mx-auto` centering. Zone-specific content is passed as `children`.
 */
export const SiteFooter: FC<PropsWithChildren> = ({ children }) => (
  <footer className="mx-auto w-full max-w-237.5 shadow-drop-up">
    <div className="bg-surface-overlay py-10 xl:border-2 xl:border-b-0 xl:border-border-subtle 2xl:mx-[-161px] 2xl:px-[161px]">
      {children}
    </div>
  </footer>
);
