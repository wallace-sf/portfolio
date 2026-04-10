import { isNil } from '~/validations/isNil';

export const isNotNil = <T>(value: T): boolean => !isNil<T>(value);
