'use client';

import { FC } from 'react';

import Image from 'next/image';

import logoDesktop from '~assets/images/logo-desktop.svg';
import logoMobile from '~assets/images/logo-mobile.svg';

import { Divider } from '../Divider';
import { MenuItem } from '../MenuItem';

export const SideNavigation: FC = () => {
  return (
    <nav
      id="side-navigation"
      className="absolute top-0 left-0 h-screen w-full lg:w-60 lg:px-4 lg:py-10 dark:bg-dark-200 z-40 flex-col shadow-1 border-0"
    >
      <header className="flex items-center lg:justify-center bg-dark-300 lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0">
        <Image
          src={logoDesktop}
          width={179}
          height={66}
          alt="Logo"
          className="hidden lg:block"
          priority
        />
        <Image
          src={logoMobile}
          width={120}
          height={44}
          alt="Logo"
          className="block lg:hidden"
          priority
        />
      </header>
      <ul className="flex flex-col gap-y-3 px-6 pt-10 lg:pt-15 lg:px-0">
        <MenuItem.Default href="/" icon="material-symbols:home">
          Home
        </MenuItem.Default>
        <MenuItem.Default href="/" icon="material-symbols:deployed-code">
          Portfólio
        </MenuItem.Default>
        <MenuItem.Default href="/" icon="material-symbols:person">
          Sobre
        </MenuItem.Default>
        <MenuItem.Default href="/" icon="material-symbols:description">
          Currículo
        </MenuItem.Default>
      </ul>
      <Divider className="mx-6 lg:hidden" />
      <ul className="flex flex-col gap-y-3 px-6 lg:pt-15 lg:px-0">
        <MenuItem.GhostLink.Default href="/" icon="devicon:linkedin">
          Linkedin
        </MenuItem.GhostLink.Default>
        <MenuItem.GhostLink.Default
          href="/"
          icon="mdi:github"
          iconClassName="text-white"
        >
          GitHub
        </MenuItem.GhostLink.Default>
        <MenuItem.GhostLink.Default
          href="/"
          icon="material-symbols:language"
          iconClassName="text-white"
        >
          Idioma
        </MenuItem.GhostLink.Default>
      </ul>
    </nav>
  );
};
