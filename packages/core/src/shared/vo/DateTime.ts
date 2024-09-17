import { Validator } from '@repo/utils';

import { ValueObject } from '../base/ValueObject';

export class DateTime extends ValueObject<string> {
  static readonly ERROR_CODE = 'ERROR_INVALID_DATETIME';

  private constructor(value?: string) {
    super({ value: value ?? new Date().toISOString(), isNew: value == null });
    this._validate(this._props.value);
  }

  static new(value?: string): DateTime {
    return new DateTime(value);
  }

  static isValid(value = ''): boolean {
    return Validator.new()
      .datetime('O valor deve ser uma data e hora válida.')
      .validate(value).isValid;
  }

  private _validate(value?: string): void {
    const isValid = DateTime.isValid(value);

    if (!isValid) throw new Error(DateTime.ERROR_CODE);
  }
}
