import { isNil } from './isNil';

export const isNotNil = <T>(value: T): boolean => !isNil<T>(value);
