import { Validator } from '@repo/utils/validator';

import { ValueObject } from '~/shared/base/ValueObject';
import { left, right, Either } from '~/shared/either';
import { ValidationError } from '~/shared/errors';

export class Url extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_URL';

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Url> {
    const { error, isValid } = Validator.of(value)
      .url('The value must be a valid URL.')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Url.ERROR_CODE, message: error }),
      );
    return right(new Url(value ?? ''));
  }
}
