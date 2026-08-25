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
  // Arbitrary defaults — no external standard or schema constraint backs
  // this range; callers with a real requirement should pass their own
  // `min`/`max` via ITextConfig instead of relying on these.
  private static readonly DEFAULT_MIN_LENGTH = 3;
  private static readonly DEFAULT_MAX_LENGTH = 50;

  private constructor(value: string, config?: ITextConfig) {
    super({ value: value.trim() }, config);
  }

  static create(
    value?: string,
    config?: ITextConfig,
  ): Either<ValidationError, Text> {
    const { min = Text.DEFAULT_MIN_LENGTH, max = Text.DEFAULT_MAX_LENGTH } =
      config ?? {};

    const { isValid } = Validator.of(value).length(min, max).validate();

    if (!isValid) return left(new ValidationError({ code: Text.ERROR_CODE }));
    return right(new Text(value!, config));
  }
}
