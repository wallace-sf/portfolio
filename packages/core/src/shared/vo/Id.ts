import { Validator } from '@repo/utils/validator';
import { v4 as uuid } from 'uuid';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Id extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_ID';

  private constructor(value: string) {
    super({ value });
  }

  static generate(): Id {
    return new Id(uuid());
  }

  static create(value: string): Either<ValidationError, Id> {
    const { error, isValid } = Validator.of(value)
      .uuid('The value must be a valid UUID.')
      .validate();

    if (!isValid && error)
      return left(new ValidationError({ code: Id.ERROR_CODE, message: error }));
    return right(new Id(value));
  }
}
