import { isString } from './isString';

export const isAlpha = (value: string): boolean => {
  return isString(value) && /^[a-zA-Z]+$/.test(value);
};
