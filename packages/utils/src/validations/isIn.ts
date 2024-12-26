import validate from 'validator/lib/isIn';

import { isString } from './isString';

export const isIn = (value: string, values: string[]): boolean =>
  isString(value) && validate(value, values);
