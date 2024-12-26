import { useCallback, useEffect } from 'react';

import { useLocalStorage, useIsClient, useDarkMode } from 'usehooks-ts';

export type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const isClient = useIsClient();
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system', {
    initializeWithValue: false,
  });
  const { isDarkMode } = useDarkMode({
    defaultValue: false,
    initializeWithValue: false,
  });

  const onThemeChange = useCallback(() => {
    if (!isClient) return;

    document.documentElement.classList.toggle(
      'dark',
      theme === 'system' ? isDarkMode : theme === 'dark',
    );
  }, [theme, isClient, isDarkMode]);

  useEffect(() => {
    onThemeChange();
  }, [onThemeChange]);

  return {
    theme,
    setTheme: useCallback(
      (value: Theme) => {
        if (value === theme) return;
        if (!['light', 'dark', 'system'].includes(value)) return;

        setTheme(value);
      },
      [theme, setTheme],
    ),
  };
};
