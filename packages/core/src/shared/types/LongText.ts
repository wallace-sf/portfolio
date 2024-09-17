import { Validator } from '@repo/utils';

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

  static isValid(value = ''): boolean {
    return Validator.new()
      .length(3, 125000, 'O texto deve ter entre 3 e 125000 caracteres.')
      .validate(value).isValid;
  }

  private _validate(value?: string): void {
    const isValid = LongText.isValid(value);

    if (!isValid) throw new Error(LongText.ERROR_CODE);
  }
}
