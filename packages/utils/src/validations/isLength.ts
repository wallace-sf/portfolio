import { isString } from './isString';

export const isLength = (value: string, { min = 0, max = 0 }) => {
  if (!isString(value)) return false;
  if (min > max) return false;

  return value.length >= min && value.length <= max;
};
