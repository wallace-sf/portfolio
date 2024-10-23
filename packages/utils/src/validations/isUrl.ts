import validate from 'validator/lib/isURL';

import { isString } from './isString';

export const isUrl = (value: string): boolean => {
  return isString(value) && validate(value, { require_protocol: true });
};
