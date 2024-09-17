import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export class Url extends ValueObject<string> {
  static readonly ERROR_CODE = 'ERROR_INVALID_URL';

  private constructor(value: string) {
    super({ value, isNew: false });
    this._validate(value);
  }

  static new(value?: string): Url {
    return new Url(value ?? '');
  }

  static isValid(value = ''): boolean {
    return Validator.new()
      .url('O valor deve ser uma URL válida.')
      .validate(value).isValid;
  }

  private _validate(value?: string): void {
    const isValid = Url.isValid(value);

    if (!isValid) throw new Error(Url.ERROR_CODE);
  }
}