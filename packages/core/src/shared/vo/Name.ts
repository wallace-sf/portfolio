import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export class Name extends ValueObject<string> {
  static readonly ERROR_CODE = 'INVALID_NAME';

  private static readonly ALPHA_REGEX = /^[\p{L}\s]+$/u;

  private constructor(value: string) {
    super({ value });
  }

  static create(value?: string): Either<ValidationError, Name> {
    const trimmed = value?.trim() ?? '';

    if (!trimmed || !Name.ALPHA_REGEX.test(trimmed))
      return left(
        new ValidationError({
          code: Name.ERROR_CODE,
          message: 'The name must contain only letters.',
        }),
      );

    if (trimmed.length < 3 || trimmed.length > 100)
      return left(
        new ValidationError({
          code: Name.ERROR_CODE,
          message: 'The name must be between 3 and 100 characters.',
        }),
      );

    return right(new Name(trimmed));
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
