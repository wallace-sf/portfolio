import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

export type FluencyValue = Readonly<typeof Fluency.LEVELS>[number];

export class Fluency extends ValueObject<FluencyValue> {
  static readonly ERROR_CODE = 'INVALID_FLUENCY';
  static readonly LEVELS = [
    'BEGINNER',
    'ELEMENTARY',
    'INTERMEDIATE',
    'UPPER-INTERMEDIATE',
    'ADVANCED',
    'NATIVE',
  ] as const;

  private constructor(value: FluencyValue) {
    super({ value });
  }

  static create(value: FluencyValue): Either<ValidationError, Fluency> {
    const { error, isValid } = Validator.new(value)
      .in([...Fluency.LEVELS], 'The value must be a valid fluency level.')
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Fluency.ERROR_CODE, message: error }),
      );

    return right(new Fluency(value));
  }

  /** @deprecated Use Fluency.create() instead */
  static new(value: FluencyValue): Fluency {
    const result = Fluency.create(value);
    if (result.isLeft()) throw result.value;
    return result.value;
  }
}
