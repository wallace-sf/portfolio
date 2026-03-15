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
    if (!(Fluency.LEVELS as readonly string[]).includes(value))
      return left(
        new ValidationError({
          code: Fluency.ERROR_CODE,
          message: 'The value must be a valid fluency level.',
        }),
      );

    return right(new Fluency(value));
  }
}
