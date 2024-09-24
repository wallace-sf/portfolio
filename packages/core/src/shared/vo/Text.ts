import { Validator, ValidationError } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

interface ITextConfig {
  min?: number;
  max?: number;
}

export class Text extends ValueObject<string, ITextConfig> {
  static readonly ERROR_CODE = 'ERROR_INVALID_TEXT';

  private constructor(value: string, config?: ITextConfig) {
    super({ value: value.trim(), isNew: false }, config);
    this._validate(this._props.value);
  }

  static new(value?: string, config?: ITextConfig): Text {
    return new Text(value ?? '', config);
  }

  private _validate(value?: string): void {
    const { min = 3, max = 50 } = this._config;

    const { error, isValid } = Validator.new()
      .length(min, max, 'O texto deve ter entre {{min}} e {{max}} caracteres.')
      .validate(value);

    const ERROR_CODE = Text.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
