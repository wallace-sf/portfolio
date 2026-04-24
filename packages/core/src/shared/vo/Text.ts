import { Validator } from '@repo/utils/validator';

import { ValueObject } from '../base/ValueObject';
import { left, right, Either } from '../either';
import { ValidationError } from '../errors';

interface ITextConfig {
  min?: number;
  max?: number;
}

export class Text extends ValueObject<string, ITextConfig> {
  static readonly ERROR_CODE = 'INVALID_TEXT';

  private constructor(value: string, config?: ITextConfig) {
    super({ value: value.trim() }, config);
  }

  static create(
    value?: string,
    config?: ITextConfig,
  ): Either<ValidationError, Text> {
    const { min = 3, max = 50 } = config ?? {};

    const { error, isValid } = Validator.of(value)
      .length(
        min,
        max,
        'The value must be between {{min}} and {{max}} characters.',
      )
      .validate();

    if (!isValid && error)
      return left(
        new ValidationError({ code: Text.ERROR_CODE, message: error }),
      );
    return right(new Text(value ?? '', config));
  }
}
