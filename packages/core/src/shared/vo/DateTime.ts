import { Validator } from '@repo/utils/validator';

import { ValueObject } from '~/shared/base/ValueObject';
import { left, right, Either } from '~/shared/either';
import { ValidationError } from '~/shared/errors';

export class DateTime extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_DATE_TIME';

  private constructor(value: string) {
    super({ value });
  }

  static now(): DateTime {
    return new DateTime(new Date().toISOString());
  }

  static create(value: string): Either<ValidationError, DateTime> {
    const { error, isValid } = Validator.of(value)
      .datetime('The value must be a valid date and time.')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: DateTime.ERROR_CODE, message: error }),
      );

    return right(new DateTime(value));
  }

  get ms(): number {
    return new Date(this.value).getTime();
  }
}
