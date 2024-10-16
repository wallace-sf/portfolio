'use client';

import { FC, useCallback } from 'react';

import classNames from 'classnames';

import {
  RadioGroup,
  Radio,
  RadioGroupProps,
  RadioGroupChildrenFn,
} from '~components/Control';
import { Divider } from '~components/View';
import { useLanguage } from '~hooks';

import { useLayout } from '../useLayout';
import { LANGUAGES_OPTIONS } from './constants';
import { MenuItem } from './MenuItem';

export const SideNavigation: FC = () => {
  const [language, setLanguage] = useLanguage();
  const { open } = useLayout();

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
      className={classNames(
        'h-sidenav-mobile lg:h-sidenav-desktop left-0 w-full lg:w-60 lg:px-4 dark:bg-dark-200 z-40 flex-col border-0 duration-300 ease-linear lg:!translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
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
