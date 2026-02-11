import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';
import { ValidationError } from '../errors';

export type FluencyValue = Readonly<typeof Fluency.LEVELS>[number];

export class Fluency extends ValueObject<FluencyValue> {
  static readonly ERROR_CODE = 'ERROR_INVALID_FLUENCY';
  static readonly LEVELS = [
    'BEGINNER',
    'ELEMENTARY',
    'INTERMEDIATE',
    'UPPER-INTERMEDIATE',
    'ADVANCED',
    'NATIVE',
  ] as const;

  private constructor(value: FluencyValue) {
    super({ value, isNew: false });
    this._validate(value);
  }

  static new(value: FluencyValue): Fluency {
    return new Fluency(value);
  }

  private _validate(value: string): void {
    const { error, isValid } = Validator.new(value)
      .in([...Fluency.LEVELS], 'O valor deve ser um nível de fluência válido.')
      .validate();

    const ERROR_CODE = Fluency.ERROR_CODE;

    if (!isValid && error)
      throw new ValidationError({ code: ERROR_CODE, message: error });
  }
}
