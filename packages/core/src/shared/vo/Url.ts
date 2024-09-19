import { Validator, ValidationError } from '@repo/utils';

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

  private _validate(value?: string): void {
    const { error, isValid } = Validator.new()
      .url('O valor deve ser uma URL válida.')
      .validate(value);

    const ERROR_CODE = Url.ERROR_CODE;

    if (!isValid && error) throw new ValidationError(ERROR_CODE, error);
  }
}
