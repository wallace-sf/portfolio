'use client';

import { FC, useCallback } from 'react';

import classNames from 'classnames';
import { useTranslations, useLocale } from 'next-intl';

import {
  RadioGroup,
  Radio,
  RadioGroupProps,
  RadioGroupChildrenFn,
} from '~components/Control';
import { Divider } from '~components/View';
import { useRouter } from '~i18n/routing';

import { useLayout } from '../useLayout';
import { LANGUAGES_OPTIONS } from './constants';
import { MenuItem } from './MenuItem';

export const SideNavigation: FC = () => {
  const { open } = useLayout();
  const t = useTranslations('SideNavigation');
  const locale = useLocale();
  const { replace } = useRouter();

  const onChangeLanguage = useCallback<RadioGroupProps['onChange']>(
    (event) => {
      replace(event.target.value);
    },
    [replace],
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
        'h-sidenav-mobile xl:h-sidenav-desktop left-0 w-full xl:w-60 xl:px-4 dark:bg-dark-200 flex flex-col border-0 duration-300 ease-linear xl:!translate-x-0 z-9999',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <ul className="flex flex-col gap-y-3 px-6 pt-10 xl:pt-15 xl:px-0">
        <MenuItem.Item1 href="/" icon="material-symbols:home">
          {t('home')}
        </MenuItem.Item1>
        <MenuItem.Item1 href="/projects" icon="material-symbols:deployed-code">
          {t('projects')}
        </MenuItem.Item1>
        <MenuItem.Item1 href="/about" icon="material-symbols:person">
          {t('about')}
        </MenuItem.Item1>
        <MenuItem.Item1 href="/resume" icon="material-symbols:description">
          {t('resume')}
        </MenuItem.Item1>
      </ul>
      <Divider className="mx-6 xl:hidden" />
      <ul className="flex flex-col h-full gap-y-3 px-6 xl:pb-8 xl:px-0 xl:justify-end">
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
          title={t('language')}
          icon="material-symbols:language"
          iconClassName="text-white"
        >
          <RadioGroup
            name="language"
            value={locale}
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
