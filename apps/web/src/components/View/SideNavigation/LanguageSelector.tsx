'use client';

import { FC, useCallback } from 'react';

import {
  Radio,
  RadioGroup,
  RadioGroupChildrenFn,
  RadioGroupProps,
} from '@repo/ui/Control';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { usePathname } from '~i18n/routing';

import { MenuItem } from '../MenuItem';
import { LANGUAGES_OPTIONS } from './constants';

export const LanguageSelector: FC = () => {
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

  const renderLanguages = useCallback<RadioGroupChildrenFn>(
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
        className="flex flex-col gap-y-2"
      >
        {renderLanguages}
      </RadioGroup>
    </MenuItem.Item2.Expandable>
  );
};
