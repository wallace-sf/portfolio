import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Url extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_URL';

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Url> {
    const { isValid } = Validator.of(value)
      .url('The value must be a valid URL.')
      .validate();

    if (!isValid) return left(new ValidationError({ code: Url.ERROR_CODE }));
    return right(new Url(value!));
  }
}
