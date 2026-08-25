import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Email extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_EMAIL';
  /** Practical minimum for a syntactically valid address, e.g. `a@b.co`. */
  private static readonly MIN_LENGTH = 3;
  /** RFC 5321 §4.5.3.1.3 — max length of the reverse-path/forward-path (mailbox). */
  private static readonly MAX_LENGTH = 254;

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Email> {
    const normalized = value?.trim().toLowerCase() ?? '';
    const { isValid } = Validator.of(normalized)
      .length(Email.MIN_LENGTH, Email.MAX_LENGTH)
      .email()
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
