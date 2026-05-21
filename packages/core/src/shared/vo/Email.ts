import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Email extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_EMAIL';

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Email> {
    const normalized = value?.trim().toLowerCase() ?? '';
    const { isValid } = Validator.of(normalized)
      .length(3, 254, 'invalid-email')
      .email('invalid-email')
      .validate();

    if (!isValid) return left(new ValidationError({ code: Email.ERROR_CODE }));

    return right(new Email(normalized));
  }

  public get domain(): string {
    return this.value.split('@')[1]!;
  }

  public get localPart(): string {
    return this.value.split('@')[0]!;
  }
}
