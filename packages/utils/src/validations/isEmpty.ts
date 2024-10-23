import { isString } from './isString';

export const isEmpty = (value: string): boolean => {
  return isString(value) && value.length === 0;
};
