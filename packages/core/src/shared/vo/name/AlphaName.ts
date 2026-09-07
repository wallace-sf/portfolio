import { Either, left, right } from '../../either';
import { ValidationError } from '../../errors';
import { AbstractName } from './AbstractName';

/**
 * A proper-noun label: letters and spaces only, 3–100 characters.
 * Used for the name of a *thing* (a language, a social network).
 */
export class AlphaName extends AbstractName {
  static readonly ERROR_CODE = 'INVALID_ALPHA_NAME';

  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 100;

  private constructor(value: string) {
    super(value);
  }

  static create(raw?: string): Either<ValidationError, AlphaName> {
    const result = AbstractName.parse(raw, AlphaName.ERROR_CODE, (validator) =>
      validator.alpha().length(AlphaName.MIN_LENGTH, AlphaName.MAX_LENGTH),
    );
    if (result.isLeft()) return left(result.value);

    return right(new AlphaName(result.value));
  }
}
