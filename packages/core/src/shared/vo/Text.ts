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
    const trimmed = value?.trim() ?? '';

    if (trimmed.length < min || trimmed.length > max)
      return left(
        new ValidationError({
          code: Text.ERROR_CODE,
          message: `The value must be between ${min} and ${max} characters.`,
        }),
      );

    return right(new Text(trimmed, config));
  }
}
