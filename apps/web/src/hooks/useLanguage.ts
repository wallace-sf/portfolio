'use client';

import { useLocalStorage } from 'usehooks-ts';

import { LANGUAGES } from '~utils';

const DEFAULT_LANGUAGE = LANGUAGES[0] as string;

export const useLanguage = () => {
  const [language, setLanguage] = useLocalStorage<string>(
    'language',
    DEFAULT_LANGUAGE,
    {
      initializeWithValue: false,
    },
  );

  return [language, setLanguage] as const;
};
