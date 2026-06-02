import { Validator } from '@repo/utils/validator';

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
    const { isValid } = Validator.of(value).datetime().validate();

    if (!isValid)
      return left(new ValidationError({ code: DateTime.ERROR_CODE }));

    return right(new DateTime(value));
  }

  get ms(): number {
    return new Date(this.value).getTime();
  }
}
