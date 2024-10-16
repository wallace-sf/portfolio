import resolveConfig from 'tailwindcss/resolveConfig';

import twConfig from '~/../tailwind.config';

import { pxToNumber } from '../transformers';

const resolvedConfig = resolveConfig(twConfig);

export const BREAKPOINTS = resolvedConfig.theme.screens;
export const BREAKPOINTS_NUMBERS = Object.entries(BREAKPOINTS).reduce(
  (acc, [key, value]) => {
    acc[key as keyof typeof BREAKPOINTS] = pxToNumber(value);

    return acc;
  },
  {} as Record<keyof typeof BREAKPOINTS, number>,
);
