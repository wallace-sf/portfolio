import { Validator } from '@repo/utils/validator';

import { Either, left, right } from '~/shared/either';
import { ValidationError } from '~/shared/errors';

export function validateEnum<T extends string>(
  value: T,
  allowed: T[],
  code: string,
  message: string,
): Either<ValidationError, T> {
  const { error, isValid } = Validator.of(value)
    .in(allowed as string[], message)
    .validate();
  return isValid
    ? right(value)
    : left(new ValidationError({ code, message: error! }));
}
