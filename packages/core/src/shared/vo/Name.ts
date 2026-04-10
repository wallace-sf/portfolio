import { Validator } from '@repo/utils/validator';

import { ValueObject } from '~/shared/base/ValueObject';
import { left, right, Either } from '~/shared/either';
import { ValidationError } from '~/shared/errors';

export class Name extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_NAME';

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Name> {
    const { error, isValid } = Validator.of(value)
      .alpha('The name must contain only letters.')
      .length(
        3,
        100,
        'The name must be between {{min}} and {{max}} characters.',
      )
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Name.ERROR_CODE, message: error }),
      );

    return right(new Name(value ?? ''));
  }

  public get normalized(): string {
    return this.value.trim().replace(/\s+/g, ' ');
  }

  public get capitalized(): string {
    return this.normalized
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
