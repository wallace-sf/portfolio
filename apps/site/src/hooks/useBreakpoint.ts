import { screens as breakpoints } from '@repo/tailwind-config/screens';
import { useMediaQuery } from 'usehooks-ts';

export interface IUseBreakpointProps {
  breakpoint: keyof typeof breakpoints;
  defaultValue?: boolean;
}

export interface IUseBreakpointOptions {
  initializeWithValue?: boolean;
  defaultValue?: boolean;
}

export const useBreakpoint = (
  breakpoint: keyof typeof breakpoints,
  options: IUseBreakpointOptions = {},
) => {
  const { defaultValue = false, initializeWithValue = true } = options;

  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`, {
    defaultValue,
    initializeWithValue: initializeWithValue,
  });
};
