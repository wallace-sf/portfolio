import { Validator } from '@repo/utils/validator';

import { ValueObject } from '~/shared/base/ValueObject';
import { left, right, Either } from '~/shared/either';
import { ValidationError } from '~/shared/errors';

export class Email extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_EMAIL';

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Email> {
    const normalized = value?.trim().toLowerCase() ?? '';
    const { error, isValid } = Validator.of(normalized)
      .length(3, 254, 'Email must be between {{min}} and {{max}} characters.')
      .email('Email must be a valid format (e.g., user@example.com).')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Email.ERROR_CODE, message: error }),
      );

    return right(new Email(normalized));
  }

  public get domain(): string {
    return this.value.split('@')[1]!;
  }

  public get localPart(): string {
    return this.value.split('@')[0]!;
  }
}
