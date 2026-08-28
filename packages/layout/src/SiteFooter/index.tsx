import { FC, PropsWithChildren } from 'react';

/**
 * The footer band shared across the `site` and `blog` zones: the `<footer>`
 * landmark with the consistent max width, surface, padding, top border and
 * upward shadow. Zone-specific content (contact section, copyright, social
 * links) is passed as `children`.
 */
export const SiteFooter: FC<PropsWithChildren> = ({ children }) => (
  <footer className="mx-auto w-full max-w-237.5 bg-surface-overlay py-10 shadow-drop-up xl:border-2 xl:border-b-0 xl:border-border-subtle 2xl:mx-[-161px] 2xl:px-[161px]">
    {children}
  </footer>
);
