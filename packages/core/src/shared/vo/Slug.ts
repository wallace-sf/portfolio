import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Slug extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_SLUG';
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  private static readonly MAX_LENGTH = 100;

  private constructor(value: string) {
    super({ value });
  }

  static create(raw?: string): Either<ValidationError, Slug> {
    const normalized = raw?.trim().toLowerCase() ?? '';

    const { error, isValid } = Validator.of(normalized)
      .length(3, Slug.MAX_LENGTH, 'Slug must be at least 3 characters.')
      .regex(
        Slug.SLUG_REGEX,
        'Slug must be kebab-case (lowercase letters, numbers and hyphens only).',
      )
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Slug.ERROR_CODE, message: error }),
      );

    return right(new Slug(normalized));
  }

  toPath(): string {
    return `/${this.value}`;
  }
}
