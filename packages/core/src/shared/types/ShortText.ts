import { ValueObject } from '../base/ValueObject';

export class ShortText extends ValueObject<string> {
  static readonly ERROR_INVALID_SHORT_TEXT = 'ERROR_INVALID_SHORT_TEXT';

  private constructor(value: string) {
    super({ value: value.trim(), isNew: false });
    this._validate(this._props.value);
  }

  static new(value?: string): ShortText {
    return new ShortText(value ?? '');
  }

  static isValid(value = ''): boolean {
    return value.length >= 3 && value.length <= 300;
  }

  private _validate(value?: string): void {
    const isValid = ShortText.isValid(value);

    if (!isValid) throw new Error(ShortText.ERROR_INVALID_SHORT_TEXT);
  }
}
