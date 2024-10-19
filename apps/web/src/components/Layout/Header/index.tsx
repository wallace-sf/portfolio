'use client';

import { FC } from 'react';

import Image from 'next/image';

import logoDesktop from '~assets/images/logo-desktop.svg';
import logoMobile from '~assets/images/logo-mobile.svg';

import { Button } from '../../Control';
import { Icon } from '../../Imagery';
import { useLayout } from '../useLayout';

export const Header: FC = () => {
  const { open, toggle } = useLayout();

  return (
    <header className="w-full lg:w-60 flex items-center lg:items-end justify-between lg:justify-center bg-dark-300 lg:!bg-dark-200 lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0 transition-all duration-300 ease-linear h-header-mobile lg:h-header-desktop">
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
      <Button.Base
        className="flex items-center justify-center h-10 w-10 !bg-dark-600 hover:!bg-dark-500 !rounded !p-0 lg:hidden"
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
