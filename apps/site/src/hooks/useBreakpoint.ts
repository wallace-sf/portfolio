import resolveConfig from 'tailwindcss/resolveConfig';
import { useMediaQuery } from 'usehooks-ts';

import twConfig from '../../tailwind.config';

const resolvedConfig = resolveConfig(twConfig);
const breakpoints = resolvedConfig.theme.screens;

export const useBreakpoint = (breakpoint: keyof typeof breakpoints) => {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`, {
    defaultValue: false,
  });
};
