import { Validator, ValidationError } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export class LongText extends ValueObject<string> {
  static readonly ERROR_CODE = 'ERROR_INVALID_LONG_TEXT';

  private constructor(value: string) {
    super({ value: value.trim(), isNew: false });
    this._validate(this._props.value);
  }

  static new(value?: string): LongText {
    return new LongText(value ?? '');
  }

  private _validate(value?: string): void {
    const { error, isValid } = Validator.new()
      .length(3, 125000, 'O texto deve ter entre 3 e 125000 caracteres.')
      .validate(value);

    const ERROR_CODE = LongText.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
