import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../../base/ValueObject';
import { Either, left, right } from '../../either';
import { ValidationError } from '../../errors';

/**
 * Shared base for name-like value objects: a bounded-length, letter-based
 * string. Subclasses (`AlphaName`, `PersonName`, …) only declare their
 * `ERROR_CODE` and charset/length rules — the trim → validate → wrap
 * algorithm and the display getters live here, so a new name kind is a new
 * subclass and this class never changes.
 */
export abstract class AbstractName extends ValueObject<string> {
  protected constructor(value: string) {
    super({ value });
  }

  /**
   * Trims `raw`, runs the subclass `rules` chain, and returns the normalized
   * value or a single `ValidationError` carrying `errorCode`.
   */
  protected static parse(
    raw: string | undefined,
    errorCode: string,
    rules: (validator: Validator<string>) => Validator<string>,
  ): Either<ValidationError, string> {
    const normalized = raw?.trim() ?? '';

    const { isValid } = rules(Validator.of(normalized)).validate();
    if (!isValid) return left(new ValidationError({ code: errorCode }));

    return right(normalized);
  }

  /** Collapses runs of whitespace to a single space. */
  public get normalized(): string {
    return this.value.replace(/\s+/g, ' ').trim();
  }

  /** Title-cases each word of the normalized value. */
  public get capitalized(): string {
    return this.normalized
      .toLowerCase()
      .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
  }
}
