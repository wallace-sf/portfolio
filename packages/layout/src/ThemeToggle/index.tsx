'use client';

import { FC, useCallback } from 'react';

import {
  Nav,
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioGroupChildrenFn,
} from '@repo/ui/Control';
import { useTranslations } from 'next-intl';

import { useSideNav } from '~/SideNav/context';

import { THEME_OPTIONS } from './constants';
import { type Theme, useTheme } from './useTheme';

export { useTheme, type Theme } from './useTheme';
export { useDarkMode } from './useDarkMode';
export { THEME_OPTIONS } from './constants';

export const ThemeToggle: FC = () => {
  const t = useTranslations('SideNavigation');
  const tTheme = useTranslations('Theme');
  const { theme, setTheme } = useTheme();
  const { closeMenu } = useSideNav();

  const onChangeTheme = useCallback<RadioGroupProps['onChange']>(
    (event) => {
      setTheme(event.target.value as Theme);
      closeMenu();
    },
    [setTheme, closeMenu],
  );

  const renderThemes = useCallback<RadioGroupChildrenFn>(
    ({ name, value, onChange }) => {
      return (
        <ul className="flex flex-col gap-y-2">
          {THEME_OPTIONS.map(({ option, icon }) => (
            <li key={option} className="flex flex-row gap-x-3">
              <Radio
                id={option}
                name={name}
                value={value}
                onChange={onChange}
                option={option}
                icon={icon}
                iconClassName="text-black dark:text-white"
              >
                {tTheme(option)}
              </Radio>
            </li>
          ))}
        </ul>
      );
    },
    [tTheme],
  );

  return (
    <Nav.Expandable
      title={t('theme')}
      icon="material-symbols:contrast"
      iconClassName="text-content-primary"
    >
      <RadioGroup
        name="theme"
        value={theme}
        onChange={onChangeTheme}
        legend={t('theme')}
      >
        {renderThemes}
      </RadioGroup>
    </Nav.Expandable>
  );
};
