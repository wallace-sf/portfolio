import validate from 'validator/lib/isUUID';

import { isString } from './isString';

export const isUUID = (value: unknown): boolean =>
  isString(value) && validate(value);
