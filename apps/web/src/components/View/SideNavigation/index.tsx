'use client';

import { FC, useCallback } from 'react';

import {
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioGroupChildrenFn,
} from '@repo/ui/Control';
import { Divider } from '@repo/ui/View';
import classNames from 'classnames';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useLayout } from '~hooks';
import { usePathname } from '~i18n/routing';

import { MenuItem } from '../MenuItem';
import { LANGUAGES_OPTIONS } from './constants';

export const SideNavigation: FC = () => {
  const { open } = useLayout();
  const t = useTranslations('SideNavigation');
  const locale = useLocale();
  const { replace } = useRouter();
  const pathname = usePathname();

  const onChangeLanguage = useCallback<RadioGroupProps['onChange']>(
    (event) => {
      const { value } = event.target;

      replace(pathname !== '/' ? `/${value}${pathname}` : value);
    },
    [replace, pathname],
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
        <MenuItem.Item1
          href={process.env.NEXT_PUBLIC_RESUME_URL}
          icon="material-symbols:description"
          newTab
        >
          {t('resume')}
        </MenuItem.Item1>
      </ul>
      <Divider className="mx-6 xl:mx-0" />
      <ul className="flex flex-col gap-y-3 px-6 xl:pb-8 xl:px-0 xl:justify-end">
        <MenuItem.Item2.Link
          href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
          icon="devicon:linkedin"
          newTab
        >
          Linkedin
        </MenuItem.Item2.Link>
        <MenuItem.Item2.Link
          href={process.env.NEXT_PUBLIC_GITHUB_URL}
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
          >
            {renderRadio}
          </RadioGroup>
        </MenuItem.Item2.Expandable>
      </ul>
    </nav>
  );
};
