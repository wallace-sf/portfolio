import { Either, left, right } from '../../either';
import { ValidationError } from '../../errors';
import { AbstractName } from './AbstractName';

/**
 * A human / display name: starts with a letter, then letters, spaces and the
 * punctuation names actually use — apostrophe, hyphen, period. 2–100 chars.
 * Accepts `O'Brien`, `Anne-Marie`, `J. R. R. Tolkien`; rejects digits and
 * symbols. Used for the name of a *person* (a user, a profile, an author).
 */
export class PersonName extends AbstractName {
  static readonly ERROR_CODE = 'INVALID_PERSON_NAME';

  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;
  private static readonly PATTERN = /^\p{L}[\p{L} '.-]*$/u;

  private constructor(value: string) {
    super(value);
  }

  static create(raw?: string): Either<ValidationError, PersonName> {
    const result = AbstractName.parse(raw, PersonName.ERROR_CODE, (validator) =>
      validator
        .length(PersonName.MIN_LENGTH, PersonName.MAX_LENGTH)
        .regex(PersonName.PATTERN),
    );
    if (result.isLeft()) return left(result.value);

    return right(new PersonName(result.value));
  }
}
