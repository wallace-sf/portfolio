import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../../shared/base/ValueObject';
import { left, right, Either } from '../../shared/either';
import { ValidationError } from '../../shared/errors';

export class Tag extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_TAG';
  private static readonly TAG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 50;

  private constructor(value: string) {
    super({ value });
  }

  static create(raw?: string): Either<ValidationError, Tag> {
    const normalized = raw?.trim() ?? '';

    const { isValid } = Validator.of(normalized)
      .length(Tag.MIN_LENGTH, Tag.MAX_LENGTH)
      .regex(Tag.TAG_REGEX)
      .validate();

    if (!isValid) return left(new ValidationError({ code: Tag.ERROR_CODE }));

    return right(new Tag(normalized));
  }
}
