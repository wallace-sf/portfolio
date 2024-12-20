'use client';

import { FC } from 'react';

import Image from 'next/image';

import logoDesktop from '~assets/images/logo-desktop.svg';
import logoMobile from '~assets/images/logo-mobile.svg';
import { Button } from '~components/Control';
import { Icon } from '~components/Imagery';
import { useLayout } from '~hooks';

export const Header: FC = () => {
  const { open, toggle } = useLayout();

  return (
    <header className="w-full xl:w-60 flex items-center xl:items-end justify-between xl:justify-center bg-dark-300 xl:!bg-dark-200 xl:bg-transparent px-4 py-3 xl:px-0 xl:py-0 transition-all duration-300 ease-linear h-header-mobile xl:h-header-desktop">
      <Image
        src={logoDesktop}
        width={179}
        height={66}
        alt="Logo"
        className="hidden xl:block"
        priority
      />
      <Image
        src={logoMobile}
        width={120}
        height={44}
        alt="Logo"
        className="block xl:hidden"
        priority
      />
      <Button.Base
        className="flex items-center justify-center h-10 w-10 !bg-dark-600 hover:!bg-dark-500 !rounded !p-0 xl:hidden"
        onClick={toggle}
      >
        {open ? (
          <Icon icon="ic:round-close" className="!text-dark-900" />
        ) : (
          <Icon icon="ic:round-menu" className="!text-dark-900" />
        )}
      </Button.Base>
    </header>
  );
};
