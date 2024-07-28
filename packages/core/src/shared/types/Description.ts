import { ValueObject } from '../base/ValueObject';

export class Description extends ValueObject<string> {
  static readonly ERROR_INVALID_DESCRIPTION = 'ERROR_INVALID_DESCRIPTION';

  private constructor(value: string) {
    super({ value: value.trim(), isNew: false });
    this._validate(this._props.value);
  }

  static new(value?: string): Description {
    return new Description(value ?? '');
  }

  static isValid(value = ''): boolean {
    return value.length > 0;
  }

  private _validate(value?: string): void {
    const isValid = Description.isValid(value);

    if (!isValid) throw new Error(Description.ERROR_INVALID_DESCRIPTION);
  }
}
