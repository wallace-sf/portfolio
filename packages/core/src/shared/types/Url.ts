import { ValueObject } from '../base/ValueObject';

export class Url extends ValueObject<Url, string> {
  static readonly ERROR_INVALID_URL = 'ERROR_INVALID_URL';

  private constructor(value: string) {
    super({ value, isNew: false });
    this._validate(value);
  }

  static new(value?: string): Url {
    return new Url(value ?? '');
  }

  static isValid(value = ''): boolean {
    return /^https?:\/\//.test(value);
  }

  private _validate(value?: string): void {
    const isValid = Url.isValid(value);

    if (!isValid) throw new Error(Url.ERROR_INVALID_URL);
  }
}
