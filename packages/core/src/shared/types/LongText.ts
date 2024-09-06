import { ValueObject } from '../base/ValueObject';

export class LongText extends ValueObject<string> {
  static readonly ERROR_INVALID_LONG_TEXT = 'ERROR_INVALID_LONG_TEXT';

  private constructor(value: string) {
    super({ value: value.trim(), isNew: false });
    this._validate(this._props.value);
  }

  static new(value?: string): LongText {
    return new LongText(value ?? '');
  }

  static isValid(value = ''): boolean {
    return value.length >= 3 && value.length <= 125000;
  }

  private _validate(value?: string): void {
    const isValid = LongText.isValid(value);

    if (!isValid) throw new Error(LongText.ERROR_INVALID_LONG_TEXT);
  }
}
