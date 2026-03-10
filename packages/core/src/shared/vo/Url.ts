import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Url extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_URL';

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Url> {
    const { error, isValid } = Validator.new(value)
      .url('The value must be a valid URL.')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Url.ERROR_CODE, message: error }),
      );

    return right(new Url(value ?? ''));
  }

}
