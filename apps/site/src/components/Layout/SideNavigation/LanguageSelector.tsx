'use client';

import { FC, useCallback } from 'react';

import {
  Radio,
  RadioGroup,
  RadioGroupChildrenFn,
  RadioGroupProps,
} from '@repo/ui/Control';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { LANGUAGES_OPTIONS } from './constants';
import { MenuItem } from './MenuItem';

export const LanguageSelector: FC = () => {
  const t = useTranslations('SideNavigation');
  const tLang = useTranslations('Language');
  const locale = useLocale();
  const { replace } = useRouter();
  const pathname = usePathname();

  const onChangeLanguage = useCallback<RadioGroupProps['onChange']>(
    (event) => {
      const { value } = event.target;
      replace(pathname.replace(`/${locale}`, `/${value}`));
    },
    [replace, pathname, locale],
  );

  const renderLanguages = useCallback<RadioGroupChildrenFn>(
    ({ name, value, onChange }) => {
      return (
        <ul className="flex flex-col gap-y-2">
          {LANGUAGES_OPTIONS.map(({ labelKey, icon, option }) => (
            <li key={option} className="flex flex-row gap-x-3">
              <Radio
                id={option}
                name={name}
                value={value}
                onChange={onChange}
                option={option}
                icon={icon}
              >
                {tLang(labelKey)}
              </Radio>
            </li>
          ))}
        </ul>
      );
    },
    [tLang],
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
        legend={t('language')}
      >
        {renderLanguages}
      </RadioGroup>
    </MenuItem.Item2.Expandable>
  );
};
