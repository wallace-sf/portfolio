import validate from 'validator/lib/isUUID';

import { isString } from '~/validations/isString';

export const isUUID = (value: unknown): boolean =>
  isString(value) && validate(value);
