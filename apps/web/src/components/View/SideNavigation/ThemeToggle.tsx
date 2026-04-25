'use client';

import { FC, useCallback } from 'react';

import {
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioGroupChildrenFn,
} from '@repo/ui/Control';
import { useTranslations } from 'next-intl';

import { Theme, useDarkMode, useTheme } from '~hooks';

import { MenuItem } from '../MenuItem';
import { THEME_OPTIONS } from './constants';

export const ThemeToggle: FC = () => {
  const t = useTranslations('SideNavigation');
  const { theme, setTheme } = useTheme();
  const isDarkMode = useDarkMode();

  const onChangeTheme = useCallback<RadioGroupProps['onChange']>(
    (event) => {
      setTheme(event.target.value as Theme);
    },
    [setTheme],
  );

  const renderThemes = useCallback<RadioGroupChildrenFn>(
    ({ name, value, onChange }) => {
      return THEME_OPTIONS.map(({ label, option, icon }) => (
        <li key={option} className="flex flex-row gap-x-3">
          <Radio
            id={option}
            name={name}
            value={value}
            onChange={onChange}
            option={option}
            icon={icon}
            iconClassName={isDarkMode ? 'text-white' : 'text-black'}
          >
            {label}
          </Radio>
        </li>
      ));
    },
    [isDarkMode],
  );

  return (
    <MenuItem.Item2.Expandable
      title={t('theme')}
      icon="material-symbols:contrast"
      iconClassName="text-white"
    >
      <RadioGroup
        name="theme"
        value={theme}
        onChange={onChangeTheme}
        containerElementType="ul"
        className="flex flex-col gap-y-2"
      >
        {renderThemes}
      </RadioGroup>
    </MenuItem.Item2.Expandable>
  );
};
