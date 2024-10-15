'use client';

import { FC, useCallback } from 'react';

import Image from 'next/image';

import logoDesktop from '~assets/images/logo-desktop.svg';
import logoMobile from '~assets/images/logo-mobile.svg';
import { useLanguage } from '~hooks';

import {
  RadioGroup,
  Radio,
  RadioGroupProps,
  RadioGroupChildrenFn,
} from '../../Control';
import { Divider } from '../Divider';
import { MenuItem } from '../MenuItem';
import { LANGUAGES_OPTIONS } from './constants';

export const SideNavigation: FC = () => {
  const [language, setLanguage] = useLanguage();

  const onChangeLanguage = useCallback<RadioGroupProps['onChange']>(
    (event) => {
      setLanguage(event.target.value);
    },
    [setLanguage],
  );

  const renderRadio = useCallback<RadioGroupChildrenFn>(
    ({ name, value, onChange }) => {
      return LANGUAGES_OPTIONS.map(({ label, icon, option }) => (
        <li key={option} className="flex flex-row gap-x-3">
          <Radio
            id={option}
            name={name}
            value={value}
            onChange={onChange}
            option={option}
            icon={icon}
          >
            {label}
          </Radio>
        </li>
      ));
    },
    [],
  );

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
        <MenuItem.Item1 href="/" icon="material-symbols:home">
          Home
        </MenuItem.Item1>
        <MenuItem.Item1 href="/" icon="material-symbols:deployed-code">
          Portfólio
        </MenuItem.Item1>
        <MenuItem.Item1 href="/" icon="material-symbols:person">
          Sobre
        </MenuItem.Item1>
        <MenuItem.Item1 href="/" icon="material-symbols:description">
          Currículo
        </MenuItem.Item1>
      </ul>
      <Divider className="mx-6 lg:hidden" />
      <ul className="flex flex-col gap-y-3 px-6 lg:pt-15 lg:px-0">
        <MenuItem.Item2.Link
          href="https://www.linkedin.com/in/wallace-silva-ferreira/"
          icon="devicon:linkedin"
          newTab
        >
          Linkedin
        </MenuItem.Item2.Link>
        <MenuItem.Item2.Link
          href="https://github.com/wallace-sf"
          icon="mdi:github"
          iconClassName="text-white"
          newTab
        >
          GitHub
        </MenuItem.Item2.Link>
        <MenuItem.Item2.Expandable
          title="Idioma"
          icon="material-symbols:language"
          iconClassName="text-white"
        >
          <RadioGroup
            name="language"
            value={language}
            onChange={onChangeLanguage}
            containerElementType="ul"
            className="pt-3"
          >
            {renderRadio}
          </RadioGroup>
        </MenuItem.Item2.Expandable>
      </ul>
    </nav>
  );
};
