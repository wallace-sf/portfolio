import isURL from 'validator/lib/isURL';

import { isString } from './isString';

export const isUrl = (value: string): boolean => {
  return isString(value) && isURL(value, { require_protocol: true });
};
