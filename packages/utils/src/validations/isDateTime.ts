import { DateTime } from 'luxon';

import { isString } from '~/validations/isString';

export const isDateTime = (value: unknown): boolean =>
  isString(value) && DateTime.fromISO(value).isValid;
