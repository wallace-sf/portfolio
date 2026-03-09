import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Slug extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_SLUG';
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  private constructor(value: string) {
    super({ value });
  }

  static create(raw?: string): Either<ValidationError, Slug> {
    const trimmed = raw?.trim();

    if (!trimmed || trimmed.length < 3) {
      return left(
        new ValidationError({
          code: Slug.ERROR_CODE,
          message: 'Slug must be at least 3 characters.',
        }),
      );
    }

    const normalized = trimmed.toLowerCase();

    if (!Slug.SLUG_REGEX.test(normalized)) {
      return left(
        new ValidationError({
          code: Slug.ERROR_CODE,
          message:
            'Slug must be kebab-case (lowercase letters, numbers and hyphens only).',
        }),
      );
    }

    return right(new Slug(normalized));
  }

  toPath(): string {
    return `/${this.value}`;
  }
}
