import { isString } from './isString';

export const isEmpty = (value: string): boolean => {
  if (!isString(value)) return false;
  return value.length === 0;
};
