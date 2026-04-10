import { isString } from '~/validations/isString';

export const isAlpha = (value: string): boolean => {
  return isString(value) && /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ\s]+$/i.test(value);
};
