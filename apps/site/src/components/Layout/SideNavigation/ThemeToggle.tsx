'use client';

import { FC, useCallback } from 'react';

import {
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioGroupChildrenFn,
} from '@repo/ui/Control';
import { useTranslations } from 'next-intl';

import { Theme, useTheme } from '~hooks';

import { THEME_OPTIONS } from './constants';
import { MenuItem } from './MenuItem';

export const ThemeToggle: FC = () => {
  const t = useTranslations('SideNavigation');
  const tTheme = useTranslations('Theme');
  const { theme, setTheme } = useTheme();

  const onChangeTheme = useCallback<RadioGroupProps['onChange']>(
    (event) => {
      setTheme(event.target.value as Theme);
    },
    [setTheme],
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
    <MenuItem.Item2.Expandable
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
    </MenuItem.Item2.Expandable>
  );
};
