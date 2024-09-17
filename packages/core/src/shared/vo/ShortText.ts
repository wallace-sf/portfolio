import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export class ShortText extends ValueObject<string> {
  static readonly ERROR_CODE = 'ERROR_INVALID_SHORT_TEXT';

  private constructor(value: string) {
    super({ value: value.trim(), isNew: false });
    this._validate(this._props.value);
  }

  static new(value?: string): ShortText {
    return new ShortText(value ?? '');
  }

  static isValid(value = ''): boolean {
    return Validator.new()
      .length(3, 300, 'O texto deve ter entre 3 e 300 caracteres.')
      .validate(value).isValid;
  }

  private _validate(value?: string): void {
    const isValid = ShortText.isValid(value);

    if (!isValid) throw new Error(ShortText.ERROR_CODE);
  }
}
