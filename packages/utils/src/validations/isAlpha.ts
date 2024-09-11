import { isString } from './isString';

export const isAlpha = (value: string): boolean => {
  if (!isString(value)) return false;

  return /^[a-zA-Z]+$/.test(value);
};
