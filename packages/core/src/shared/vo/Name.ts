import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Name extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_NAME';
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 100;

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Name> {
    const { isValid } = Validator.of(value)
      .alpha()
      .length(Name.MIN_LENGTH, Name.MAX_LENGTH)
      .validate();

    if (!isValid) return left(new ValidationError({ code: Name.ERROR_CODE }));

    return right(new Name(value!));
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
