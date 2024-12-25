import { useMemo } from 'react';

import { useIsClient, useDarkMode as useDarkModeHook } from 'usehooks-ts';

import { useTheme } from './useTheme';

export const useDarkMode = () => {
  const isClient = useIsClient();
  const { theme } = useTheme();
  const { isDarkMode } = useDarkModeHook({
    defaultValue: false,
    initializeWithValue: false,
  });

  return useMemo(() => {
    if (!isClient) return false;

    return theme === 'system' ? isDarkMode : theme === 'dark';
  }, [isClient, theme, isDarkMode]);
};
