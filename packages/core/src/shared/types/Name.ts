import { ValueObject } from '../base/ValueObject';

export class Name extends ValueObject<string> {
  static readonly ERROR_INVALID_NAME = 'ERROR_INVALID_NAME';

  private constructor(value: string) {
    super({ value: value.trim(), isNew: false });
    this._validate(this._props.value);
  }

  static new(value?: string): Name {
    return new Name(value ?? '');
  }

  static isValid(value = ''): boolean {
    return value.length >= 3;
  }

  private _validate(value?: string): void {
    const isValid = Name.isValid(value);

    if (!isValid) throw new Error(Name.ERROR_INVALID_NAME);
  }
}
