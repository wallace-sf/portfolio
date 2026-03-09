import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class DateTime extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_DATE_TIME';

  private constructor(value: string) {
    super({ value });
  }

  static now(): DateTime {
    return new DateTime(new Date().toISOString());
  }

  static create(value: string): Either<ValidationError, DateTime> {
    const { error, isValid } = Validator.new(value)
      .datetime('The value must be a valid date and time.')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: DateTime.ERROR_CODE, message: error }),
      );

    return right(new DateTime(value));
  }

  /** @deprecated Use DateTime.create() for validation or DateTime.now() for current time */
  static new(value?: string): DateTime {
    if (value == null) return DateTime.now();
    const result = DateTime.create(value);
    if (result.isLeft()) throw result.value;
    return result.value;
  }

  get ms(): number {
    return new Date(this.value).getTime();
  }
}
